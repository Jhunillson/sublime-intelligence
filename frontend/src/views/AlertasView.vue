<template>
  <div>
    <h1 class="page-title">🔔 Alertas · Sistema de Semáforos</h1>

    <div v-if="loading" style="text-align:center; padding:60px; color:#718096;">A carregar...</div>

    <template v-else>
      <!-- Resumo -->
      <div class="kpi-grid" style="margin-bottom:24px;">
        <div class="kpi-card" style="border-left:4px solid #fc8181;">
          <div class="kpi-label">🚨 Alertas Críticos</div>
          <div class="kpi-value" style="color:#c53030;">{{ data.resumo.criticos }}</div>
        </div>
        <div class="kpi-card" style="border-left:4px solid #f6ad55;">
          <div class="kpi-label">⚠️ Atenção</div>
          <div class="kpi-value" style="color:#c05621;">{{ data.resumo.atencao }}</div>
        </div>
        <div class="kpi-card" style="border-left:4px solid #48bb78;">
          <div class="kpi-label">✅ Indicadores OK</div>
          <div class="kpi-value" style="color:#276749;">{{ data.resumo.ok }}</div>
        </div>
      </div>

      <!-- Lista de alertas -->
      <div class="card">
        <div v-for="a in data.alertas" :key="a.id" :class="['alerta', `alerta-${a.estado}`]">
          <div class="alerta-header">
            <span class="alerta-badge" :class="`badge-${a.estado}`">
              {{ a.estado === 'critico' ? '🔴 CRÍTICO' : a.estado === 'atencao' ? '🟡 ATENÇÃO' : '🟢 OK' }}
            </span>
            <strong>{{ a.area }}</strong>
            <span class="alerta-indicador">{{ a.indicador }}</span>
          </div>
          <p class="alerta-diagnostico">{{ a.diagnostico }}</p>
          <p class="alerta-acao">→ {{ a.acao }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { alertasService } from '../services/api';

const loading = ref(true);
const data = ref({ resumo: {}, alertas: [] });

onMounted(async () => {
  try {
    const res = await alertasService.get();
    data.value = res.data;
  } catch(e) { console.error(e); }
  finally { loading.value = false; }
});
</script>

<style scoped>
.alerta { padding: 16px; border-radius: 8px; margin-bottom: 12px; }
.alerta-critico { background: #fff5f5; border-left: 4px solid #fc8181; }
.alerta-atencao { background: #fffbeb; border-left: 4px solid #f6ad55; }
.alerta-ok { background: #f0fff4; border-left: 4px solid #48bb78; }
.alerta-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.alerta-indicador { font-size: 13px; color: #718096; margin-left: auto; }
.alerta-diagnostico { font-size: 14px; color: #2d3748; margin-bottom: 4px; }
.alerta-acao { font-size: 13px; color: #718096; font-style: italic; }
.badge-critico { background:#fed7d7; color:#c53030; padding:3px 10px; border-radius:4px; font-size:11px; font-weight:700; white-space:nowrap; }
.badge-atencao { background:#fef3c7; color:#92400e; padding:3px 10px; border-radius:4px; font-size:11px; font-weight:700; white-space:nowrap; }
.badge-ok { background:#c6f6d5; color:#276749; padding:3px 10px; border-radius:4px; font-size:11px; font-weight:700; white-space:nowrap; }
</style>
