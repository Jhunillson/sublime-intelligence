<template>
  <div>
    <h1 class="page-title">💵 Fluxo de Caixa · 2025</h1>
    <div v-if="loading" style="text-align:center; padding:60px; color:#718096;">A carregar...</div>
    <template v-else>
      <div class="kpi-grid" style="margin-bottom:24px;">
        <div class="kpi-card">
          <div class="kpi-label">💰 Total Entradas</div>
          <div class="kpi-value" style="color:#276749;">{{ fmt(dash.kpis.receita_anual) }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">💸 Total Saídas</div>
          <div class="kpi-value" style="color:#c53030;">{{ fmt(dash.kpis.custo_anual) }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">📊 Saldo Líquido</div>
          <div class="kpi-value" :style="{ color: dash.kpis.lucro_liquido >= 0 ? '#276749' : '#c53030' }">
            {{ fmt(dash.kpis.lucro_liquido) }}
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">⚡ Meses Negativos</div>
          <div class="kpi-value" style="color:#c53030;">{{ 12 - dash.kpis.meses_lucrativos }}</div>
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Entradas</th>
                <th>Saídas</th>
                <th>Saldo Mensal</th>
                <th>Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(m, i) in dash.mensal" :key="m.mes">
                <td>{{ MESES[m.mes - 1] }}</td>
                <td style="color:#276749;">{{ fmt(m.receita) }}</td>
                <td style="color:#c53030;">{{ fmt(m.custo) }}</td>
                <td :style="{ color: m.lucro >= 0 ? '#276749' : '#c53030', fontWeight:700 }">
                  {{ fmt(m.lucro) }}
                </td>
                <td :style="{ fontWeight:700, color: acumulado[i] >= 0 ? '#276749' : '#c53030' }">
                  {{ fmt(acumulado[i]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { dashboardService } from '../services/api';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const loading = ref(true);
const dash = ref({ kpis: {}, mensal: [] });

const acumulado = computed(() => {
  let acc = 0;
  return dash.value.mensal.map(m => { acc += m.lucro; return acc; });
});

function fmt(val) {
  if (val === undefined || val === null) return '—';
  return new Intl.NumberFormat('pt-PT').format(Math.round(val)) + ' Kz';
}

onMounted(async () => {
  try {
    const res = await dashboardService.get();
    dash.value = res.data;
  } catch(e) { console.error(e); }
  finally { loading.value = false; }
});
</script>
