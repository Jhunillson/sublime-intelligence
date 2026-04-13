<template>
  <div>
    <h1 class="page-title">📊 Dashboard Financeiro · 2025</h1>

    <div v-if="loading" style="text-align:center; padding: 60px; color: #718096;">A carregar...</div>

    <template v-else>
      <!-- KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">💰 Receita Anual</div>
          <div class="kpi-value">{{ fmt(data.kpis.receita_anual) }}</div>
          <div class="kpi-sub">Exercício 2025</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">💸 Custos Totais</div>
          <div class="kpi-value">{{ fmt(data.kpis.custo_anual) }}</div>
          <div class="kpi-sub">{{ pct(data.kpis.custo_anual, data.kpis.receita_anual) }} da receita</div>
        </div>
        <div class="kpi-card" :style="{ borderLeft: `4px solid ${data.kpis.lucro_liquido >= 0 ? '#48bb78' : '#fc8181'}` }">
          <div class="kpi-label">📈 Lucro Líquido</div>
          <div class="kpi-value" :style="{ color: data.kpis.lucro_liquido >= 0 ? '#276749' : '#c53030' }">
            {{ fmt(data.kpis.lucro_liquido) }}
          </div>
          <div class="kpi-sub">Margem: {{ (data.kpis.margem_liquida * 100).toFixed(1) }}%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">🏆 Melhor Mês</div>
          <div class="kpi-value">{{ MESES[data.kpis.melhor_mes - 1] || '—' }}</div>
          <div class="kpi-sub">{{ fmt(data.kpis.melhor_mes_valor) }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">📅 Meses Lucrativos</div>
          <div class="kpi-value">{{ data.kpis.meses_lucrativos }} / 12</div>
          <div class="kpi-sub">{{ data.kpis.meses_lucrativos < 12 ? `⚠️ ${12 - data.kpis.meses_lucrativos} negativos` : '🌟 Ano perfeito' }}</div>
        </div>
      </div>

      <!-- Tabela mensal -->
      <div class="card" style="margin-bottom: 24px;">
        <h2 style="font-size:16px; margin-bottom:16px;">Resumo Mensal</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Receita (Kz)</th>
                <th>Custos (Kz)</th>
                <th>Lucro (Kz)</th>
                <th>Margem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in data.mensal" :key="m.mes">
                <td>{{ MESES[m.mes - 1] }}</td>
                <td>{{ fmt(m.receita) }}</td>
                <td>{{ fmt(m.custo) }}</td>
                <td :style="{ color: m.lucro >= 0 ? '#276749' : '#c53030', fontWeight: 700 }">
                  {{ fmt(m.lucro) }}
                </td>
                <td :style="{ color: m.margem >= 0 ? '#276749' : '#c53030' }">
                  {{ (m.margem * 100).toFixed(1) }}%
                </td>
              </tr>
              <tr style="font-weight:700; background:#f7fafc;">
                <td>TOTAL</td>
                <td>{{ fmt(data.kpis.receita_anual) }}</td>
                <td>{{ fmt(data.kpis.custo_anual) }}</td>
                <td :style="{ color: data.kpis.lucro_liquido >= 0 ? '#276749' : '#c53030' }">{{ fmt(data.kpis.lucro_liquido) }}</td>
                <td>{{ (data.kpis.margem_liquida * 100).toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Custos por categoria -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div class="card">
          <h2 style="font-size:16px; margin-bottom:16px;">Top Custos por Categoria</h2>
          <div v-for="c in data.custos_por_categoria.slice(0,8)" :key="c.nome" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>{{ c.icone }} {{ c.nome }}</span>
              <strong>{{ fmt(c.total) }}</strong>
            </div>
            <div style="height:6px; background:#e2e8f0; border-radius:3px; margin-top:4px;">
              <div :style="{ width: pct(c.total, data.kpis.custo_anual), height: '100%', background: '#fc8181', borderRadius: '3px' }"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h2 style="font-size:16px; margin-bottom:16px;">Top Receitas por Categoria</h2>
          <div v-for="r in data.receitas_por_categoria.slice(0,8)" :key="r.nome" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>{{ r.icone }} {{ r.nome }}</span>
              <strong>{{ fmt(r.total) }}</strong>
            </div>
            <div style="height:6px; background:#e2e8f0; border-radius:3px; margin-top:4px;">
              <div :style="{ width: pct(r.total, data.kpis.receita_anual), height: '100%', background: '#48bb78', borderRadius: '3px' }"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dashboardService } from '../services/api';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const loading = ref(true);
const data = ref({ kpis: {}, mensal: [], custos_por_categoria: [], receitas_por_categoria: [] });

function fmt(val) {
  if (val === undefined || val === null) return '—';
  return new Intl.NumberFormat('pt-PT').format(Math.round(val)) + ' Kz';
}

function pct(val, total) {
  if (!total) return '0%';
  return (val / total * 100).toFixed(1) + '%';
}

onMounted(async () => {
  try {
    const res = await dashboardService.get();
    data.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
