<template>
  <div class="app">
    <!-- Top bar mobile -->
    <header class="topbar">
      <div class="logo-mobile">
        <span>💡</span>
        <strong>Sublime Intelligence</strong>
      </div>
      <button class="menu-btn" @click="menuAberto = !menuAberto">☰</button>
    </header>

    <!-- Overlay -->
    <div class="overlay" v-if="menuAberto" @click="menuAberto = false"></div>

    <!-- Sidebar -->
    <nav class="sidebar" :class="{ aberto: menuAberto }">
      <div class="logo">
        <span class="logo-icon">💡</span>
        <span class="logo-text">Sublime<br><strong>Intelligence</strong></span>
      </div>
      <ul class="nav-links">
        <li><RouterLink to="/" @click="menuAberto = false">📊 Dashboard</RouterLink></li>
        <li><RouterLink to="/entradas" @click="menuAberto = false">📥 Entradas</RouterLink></li>
        <li><RouterLink to="/saidas" @click="menuAberto = false">📤 Saídas</RouterLink></li>
        <li><RouterLink to="/faturacao" @click="menuAberto = false">🧾 Faturação</RouterLink></li>
        <li><RouterLink to="/resultados" @click="menuAberto = false">📑 Dem. Resultados</RouterLink></li>
        <li><RouterLink to="/fluxo" @click="menuAberto = false">💵 Fluxo de Caixa</RouterLink></li>
        <li><RouterLink to="/alertas" @click="menuAberto = false">🔔 Alertas</RouterLink></li>
      </ul>
      <div class="sidebar-footer">
        <p>Silva Moveleira</p>
        <p>Luanda, Angola · 2025</p>
      </div>
    </nav>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const menuAberto = ref(false);
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; color: #1a202c; }
.app { display: flex; min-height: 100vh; flex-direction: column; }

/* Top bar — só visível no mobile */
.topbar {
  display: none;
  background: #1a1f2e;
  color: #fff;
  padding: 14px 20px;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo-mobile { display: flex; align-items: center; gap: 8px; font-size: 15px; }
.menu-btn { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }

/* Overlay */
.overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 150;
}

/* Sidebar */
.sidebar {
  width: 220px; background: #1a1f2e; color: #fff;
  display: flex; flex-direction: column; padding: 24px 0;
  position: fixed; height: 100vh; z-index: 200;
  transition: transform 0.25s ease;
}
.logo { display: flex; align-items: center; gap: 10px; padding: 0 20px 24px; border-bottom: 1px solid #2d3748; }
.logo-icon { font-size: 28px; }
.logo-text { font-size: 13px; line-height: 1.4; color: #a0aec0; }
.logo-text strong { color: #fff; font-size: 15px; }
.nav-links { list-style: none; margin-top: 16px; flex: 1; }
.nav-links li a { display: block; padding: 12px 20px; color: #a0aec0; text-decoration: none; font-size: 14px; transition: all 0.2s; }
.nav-links li a:hover, .nav-links li a.router-link-active { background: #2d3748; color: #fff; border-left: 3px solid #4299e1; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid #2d3748; font-size: 11px; color: #718096; }

.content { margin-left: 220px; flex: 1; padding: 32px; min-width: 0; }

/* Cards e layout */
.card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
.kpi-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.kpi-label { font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #1a202c; word-break: break-word; }
.kpi-sub { font-size: 12px; color: #a0aec0; margin-top: 4px; }
.page-title { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #1a202c; }

/* Tabelas */
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 500px; }
th { background: #f7fafc; padding: 10px 12px; text-align: right; font-weight: 600; color: #4a5568; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
th:first-child { text-align: left; }
td { padding: 10px 12px; text-align: right; border-bottom: 1px solid #f0f4f8; white-space: nowrap; }
td:first-child { text-align: left; font-weight: 500; }
tr:hover td { background: #f7fafc; }
input[type="number"] { width: 100%; min-width: 80px; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; text-align: right; }
input[type="number"]:focus { outline: none; border-color: #4299e1; }
.btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-primary { background: #4299e1; color: #fff; }
.btn-primary:hover { background: #3182ce; }
.btn-danger { background: #fc8181; color: #fff; }
.btn-danger:hover { background: #e53e3e; }

/* ===== MOBILE ===== */
@media (max-width: 768px) {
  .app { flex-direction: column; }

  .topbar { display: flex; }

  .overlay { display: block; }

  .sidebar {
    transform: translateX(-100%);
    top: 0;
  }
  .sidebar.aberto {
    transform: translateX(0);
  }

  .content {
    margin-left: 0;
    padding: 16px;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .kpi-card { padding: 14px; }
  .kpi-value { font-size: 18px; }

  .card { padding: 16px; }

  .page-title { font-size: 17px; margin-bottom: 16px; }
}

@media (max-width: 420px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
  .kpi-value { font-size: 15px; }
  .kpi-label { font-size: 10px; }
}
</style>
