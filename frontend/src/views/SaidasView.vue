<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h1 class="page-title" style="margin-bottom:0;">📤 Saídas · Custos 2025</h1>
      <span style="font-size:13px; color:#718096;">Clique em qualquer valor para editar · Auto-guarda</span>
    </div>

    <div v-if="loading" style="text-align:center; padding:60px; color:#718096;">A carregar...</div>

    <div v-else class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Tipo</th>
              <th v-for="m in MESES" :key="m">{{ m }}</th>
              <th>Total Anual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.categoria_id" :style="{ background: row.tipo === 'CMV' ? '#fff5f5' : '' }">
              <td>{{ row.icone }} {{ row.nome }}</td>
              <td><span :class="row.tipo === 'CMV' ? 'badge-cmv' : 'badge-opex'">{{ row.tipo }}</span></td>
              <td v-for="(m, i) in MESES_KEYS" :key="m">
                <input
                  type="number"
                  :value="row[m]"
                  min="0"
                  @change="save(row.categoria_id, i + 1, $event.target.value)"
                />
              </td>
              <td style="font-weight:700; color:#c53030;">{{ fmt(row.total_anual) }}</td>
            </tr>
            <tr style="font-weight:700; background:#f0f4f8;">
              <td>TOTAL</td>
              <td></td>
              <td v-for="m in MESES_KEYS" :key="m">{{ fmt(totalMes(m)) }}</td>
              <td style="color:#c53030;">{{ fmt(totalAnual) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { saidasService } from '../services/api';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MESES_KEYS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

const loading = ref(true);
const rows = ref([]);

function fmt(val) {
  if (!val) return '0';
  return new Intl.NumberFormat('pt-PT').format(Math.round(val));
}

function totalMes(key) {
  return rows.value.reduce((sum, r) => sum + (parseFloat(r[key]) || 0), 0);
}

const totalAnual = computed(() => rows.value.reduce((sum, r) => sum + (parseFloat(r.total_anual) || 0), 0));

async function save(categoria_id, mes, valor) {
  try {
    await saidasService.upsert({ categoria_id, mes, valor: parseFloat(valor) || 0 });
    await load();
  } catch (e) {
    console.error('Erro ao guardar', e);
  }
}

async function load() {
  const res = await saidasService.get();
  rows.value = res.data;
}

onMounted(async () => {
  try { await load(); } catch(e) { console.error(e); } finally { loading.value = false; }
});
</script>

<style scoped>
.badge-cmv { background: #fed7d7; color: #c53030; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.badge-opex { background: #bee3f8; color: #2b6cb0; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
</style>
