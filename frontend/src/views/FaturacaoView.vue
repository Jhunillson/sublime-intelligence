<template>
  <div>
    <h1 class="page-title">🧾 Faturação</h1>

    <!-- KPIs Faturação -->
    <div class="kpi-grid" v-if="totais">
      <div class="kpi-card">
        <div class="kpi-label">Total Faturado</div>
        <div class="kpi-value">{{ fmt(totais.total_faturado) }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">IVA a Pagar (14%)</div>
        <div class="kpi-value">{{ fmt(totais.iva_a_pagar) }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Valor Recebido</div>
        <div class="kpi-value" style="color:#276749;">{{ fmt(totais.valor_recebido) }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Pendente</div>
        <div class="kpi-value" style="color:#c53030;">{{ fmt(totais.pendente_total) }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Nº Faturas</div>
        <div class="kpi-value">{{ totais.num_faturas }}</div>
        <div class="kpi-sub">{{ totais.faturas_pagas }} pagas · {{ totais.taxa_cobranca }}% cobrança</div>
      </div>
    </div>

    <!-- Formulário nova fatura -->
    <div class="card" style="margin-bottom:24px;">
      <h2 style="font-size:15px; margin-bottom:16px;">+ Nova Fatura</h2>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:12px;">
        <div>
          <label style="font-size:12px; color:#718096;">Data</label>
          <input v-model="form.data_fatura" type="date" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px; color:#718096;">Cliente</label>
          <input v-model="form.cliente" type="text" placeholder="Nome do cliente" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px; color:#718096;">Nº Fatura</label>
          <input v-model="form.numero_fatura" type="text" placeholder="FT 2025/001" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px; color:#718096;">Descrição</label>
          <input v-model="form.descricao" type="text" placeholder="Descrição" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px; color:#718096;">Valor Base (Kz)</label>
          <input v-model="form.valor_base" type="number" min="0" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px; color:#718096;">Pago (Kz)</label>
          <input v-model="form.pago" type="number" min="0" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px; color:#718096;">Status</label>
          <select v-model="form.status" style="width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;">
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
      </div>
      <div style="margin-top:16px; display:flex; gap:8px; align-items:center;">
        <button class="btn btn-primary" @click="criar">Criar Fatura</button>
        <span v-if="form.valor_base" style="font-size:13px; color:#718096;">
          IVA: {{ fmt(form.valor_base * 0.14) }} · Total c/ IVA: {{ fmt(form.valor_base * 1.14) }}
        </span>
      </div>
    </div>

    <!-- Lista de faturas -->
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="text-align:left">Nº Fatura</th>
              <th style="text-align:left">Data</th>
              <th style="text-align:left">Cliente</th>
              <th>Valor Base</th>
              <th>IVA 14%</th>
              <th>Total c/ IVA</th>
              <th>Pago</th>
              <th>Pendente</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in faturas" :key="f.id">
              <td style="text-align:left">{{ f.numero_fatura || '—' }}</td>
              <td style="text-align:left">{{ f.data_fatura?.substring(0,10) }}</td>
              <td style="text-align:left">{{ f.cliente }}</td>
              <td>{{ fmt(f.valor_base) }}</td>
              <td>{{ fmt(f.iva_valor) }}</td>
              <td style="font-weight:700;">{{ fmt(f.valor_total) }}</td>
              <td style="color:#276749;">{{ fmt(f.pago) }}</td>
              <td style="color:#c53030;">{{ fmt(f.pendente) }}</td>
              <td>
                <select :value="f.status" @change="alterarStatus(f.id, $event.target.value)" :class="'select-status ' + statusClass(f.status)">
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencido">Vencido</option>
                </select>
              </td>
              <td><button class="btn btn-danger" style="padding:4px 10px; font-size:11px;" @click="eliminar(f.id)">✕</button></td>
            </tr>
            <tr v-if="faturas.length === 0">
              <td colspan="10" style="text-align:center; padding:32px; color:#a0aec0;">Sem faturas registadas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { faturacaoService } from '../services/api';

const faturas = ref([]);
const totais = ref(null);
const form = ref({ data_fatura: '', cliente: '', numero_fatura: '', descricao: '', valor_base: 0, pago: 0, status: 'pendente' });

function fmt(val) {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('pt-PT').format(Math.round(parseFloat(val))) + ' Kz';
}

function statusClass(s) {
  return s === 'pago' ? 'badge-ok' : s === 'vencido' ? 'badge-critico' : 'badge-atencao';
}

async function load() {
  const res = await faturacaoService.get();
  faturas.value = res.data.faturas;
  totais.value = res.data.totais;
}

async function criar() {
  if (!form.value.cliente || !form.value.valor_base) return alert('Cliente e valor base são obrigatórios');
  await faturacaoService.create(form.value);
  form.value = { data_fatura: '', cliente: '', numero_fatura: '', descricao: '', valor_base: 0, pago: 0, status: 'pendente' };
  await load();
}

async function alterarStatus(id, status) {
  await faturacaoService.update(id, { status });
  await load();
}

async function eliminar(id) {
  if (!confirm('Eliminar esta fatura?')) return;
  await faturacaoService.delete(id);
  await load();
}

onMounted(load);
</script>

<style scoped>
.badge-ok { background:#c6f6d5; color:#276749; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
.badge-critico { background:#fed7d7; color:#c53030; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
.badge-atencao { background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
.select-status { border: none; border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 700; cursor: pointer; }
</style>
