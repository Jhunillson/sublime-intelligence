<template>
  <div>
    <h1 class="page-title">📑 Demonstração de Resultados · 2025</h1>
    <div v-if="loading" style="text-align:center; padding:60px; color:#718096;">A carregar...</div>
    <div v-else class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th v-for="m in MESES" :key="m">{{ m }}</th>
              <th>Total Anual</th>
              <th>% Rec.</th>
            </tr>
          </thead>
          <tbody>
            <tr class="section-header"><td colspan="15">1 · VOLUME DE NEGÓCIOS (RECEITAS)</td></tr>
            <tr v-for="r in receitas" :key="r.categoria_id">
              <td>{{ r.icone }} {{ r.nome }}</td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(r[m]) }}</td>
              <td style="font-weight:700;">{{ fmt(r.total_anual) }}</td>
              <td>{{ pct(r.total_anual, totalReceita) }}</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL RECEITAS</td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(totalReceitaMes(m)) }}</td>
              <td style="color:#276749; font-weight:700;">{{ fmt(totalReceita) }}</td>
              <td>100%</td>
            </tr>

            <tr class="section-header"><td colspan="15">2 · CUSTO DAS MERCADORIAS VENDIDAS (CMV)</td></tr>
            <tr v-for="s in cmv" :key="s.categoria_id">
              <td>{{ s.icone }} {{ s.nome }}</td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(s[m]) }}</td>
              <td style="font-weight:700;">{{ fmt(s.total_anual) }}</td>
              <td>{{ pct(s.total_anual, totalReceita) }}</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL CMV</td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(totalCMVMes(m)) }}</td>
              <td style="color:#c53030; font-weight:700;">{{ fmt(totalCMV) }}</td>
              <td>{{ pct(totalCMV, totalReceita) }}</td>
            </tr>

            <tr class="margem-row">
              <td>3 · MARGEM BRUTA (1 − 2)</td>
              <td v-for="m in MESES_KEYS" :key="m" :style="{ color: margemBrutaMes(m) >= 0 ? '#276749' : '#c53030' }">
                {{ fmt(margemBrutaMes(m)) }}
              </td>
              <td :style="{ color: margemBruta >= 0 ? '#276749' : '#c53030', fontWeight:700 }">{{ fmt(margemBruta) }}</td>
              <td>{{ pct(margemBruta, totalReceita) }}</td>
            </tr>

            <tr class="section-header"><td colspan="15">4 · CUSTOS OPERACIONAIS (OPEX)</td></tr>
            <tr v-for="s in opex" :key="s.categoria_id">
              <td>{{ s.icone }} {{ s.nome }}</td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(s[m]) }}</td>
              <td style="font-weight:700;">{{ fmt(s.total_anual) }}</td>
              <td>{{ pct(s.total_anual, totalReceita) }}</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL OPEX</td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(totalOPEXMes(m)) }}</td>
              <td style="color:#c53030; font-weight:700;">{{ fmt(totalOPEX) }}</td>
              <td>{{ pct(totalOPEX, totalReceita) }}</td>
            </tr>

            <tr class="lucro-row">
              <td>5 · RESULTADO LÍQUIDO (3 − 4)</td>
              <td v-for="m in MESES_KEYS" :key="m" :style="{ color: resultadoMes(m) >= 0 ? '#276749' : '#c53030' }">
                {{ fmt(resultadoMes(m)) }}
              </td>
              <td :style="{ color: resultado >= 0 ? '#276749' : '#c53030', fontWeight:700 }">{{ fmt(resultado) }}</td>
              <td>{{ pct(resultado, totalReceita) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { entradasService, saidasService } from '../services/api';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MESES_KEYS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

const loading = ref(true);
const receitas = ref([]);
const saidas = ref([]);

const cmv = computed(() => saidas.value.filter(s => s.tipo === 'CMV'));
const opex = computed(() => saidas.value.filter(s => s.tipo !== 'CMV'));

const totalReceita = computed(() => receitas.value.reduce((s, r) => s + parseFloat(r.total_anual || 0), 0));
const totalCMV = computed(() => cmv.value.reduce((s, r) => s + parseFloat(r.total_anual || 0), 0));
const totalOPEX = computed(() => opex.value.reduce((s, r) => s + parseFloat(r.total_anual || 0), 0));
const margemBruta = computed(() => totalReceita.value - totalCMV.value);
const resultado = computed(() => margemBruta.value - totalOPEX.value);

function totalReceitaMes(key) { return receitas.value.reduce((s, r) => s + parseFloat(r[key] || 0), 0); }
function totalCMVMes(key) { return cmv.value.reduce((s, r) => s + parseFloat(r[key] || 0), 0); }
function totalOPEXMes(key) { return opex.value.reduce((s, r) => s + parseFloat(r[key] || 0), 0); }
function margemBrutaMes(key) { return totalReceitaMes(key) - totalCMVMes(key); }
function resultadoMes(key) { return margemBrutaMes(key) - totalOPEXMes(key); }

function fmt(val) {
  if (!val && val !== 0) return '—';
  const n = parseFloat(val);
  if (n === 0) return '—';
  return new Intl.NumberFormat('pt-PT').format(Math.round(n));
}
function pct(val, total) {
  if (!total) return '—';
  return (parseFloat(val) / total * 100).toFixed(1) + '%';
}

onMounted(async () => {
  try {
    const [re, sa] = await Promise.all([entradasService.get(), saidasService.get()]);
    receitas.value = re.data.filter(r => parseFloat(r.total_anual) > 0 || true);
    saidas.value = sa.data;
  } catch(e) { console.error(e); }
  finally { loading.value = false; }
});
</script>

<style scoped>
.section-header td { background: #2d3748; color: #fff; font-weight: 700; font-size: 12px; padding: 8px 12px; letter-spacing: 0.05em; }
.total-row td { background: #f0f4f8; font-weight: 700; }
.margem-row td { background: #ebf8ff; font-weight: 700; }
.lucro-row td { background: #f0fff4; font-weight: 700; font-size: 14px; }
</style>
