<template>
  <div class="app">
    <nav class="sidebar">
      <div class="logo">
        <span class="logo-icon">💡</span>
        <span class="logo-text">Sublime<br><strong>Intelligence</strong></span>
      </div>
      <ul class="nav-links">
        <li><RouterLink to="/">📊 Dashboard</RouterLink></li>
        <li><RouterLink to="/entradas">📥 Entradas</RouterLink></li>
        <li><RouterLink to="/saidas">📤 Saídas</RouterLink></li>
        <li><RouterLink to="/faturacao">🧾 Faturação</RouterLink></li>
        <li><RouterLink to="/resultados">📑 Dem. Resultados</RouterLink></li>
        <li><RouterLink to="/fluxo">💵 Fluxo de Caixa</RouterLink></li>
        <li><RouterLink to="/alertas">🔔 Alertas</RouterLink></li>
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
import { RouterLink, RouterView } from 'vue-router';
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; color: #1a202c; }
.app { display: flex; min-height: 100vh; }

.sidebar {
  width: 220px; background: #1a1f2e; color: #fff;
  display: flex; flex-direction: column; padding: 24px 0;
  position: fixed; height: 100vh;
}
.logo { display: flex; align-items: center; gap: 10px; padding: 0 20px 24px; border-bottom: 1px solid #2d3748; }
.logo-icon { font-size: 28px; }
.logo-text { font-size: 13px; line-height: 1.4; color: #a0aec0; }
.logo-text strong { color: #fff; font-size: 15px; }
.nav-links { list-style: none; margin-top: 16px; flex: 1; }
.nav-links li a { display: block; padding: 12px 20px; color: #a0aec0; text-decoration: none; font-size: 14px; transition: all 0.2s; }
.nav-links li a:hover, .nav-links li a.router-link-active { background: #2d3748; color: #fff; border-left: 3px solid #4299e1; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid #2d3748; font-size: 11px; color: #718096; }
.content { margin-left: 220px; flex: 1; padding: 32px; }

.card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.kpi-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.kpi-label { font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.kpi-value { font-size: 24px; font-weight: 700; color: #1a202c; }
.kpi-sub { font-size: 12px; color: #a0aec0; margin-top: 4px; }
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; color: #1a202c; }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { background: #f7fafc; padding: 10px 12px; text-align: right; font-weight: 600; color: #4a5568; border-bottom: 2px solid #e2e8f0; }
th:first-child { text-align: left; }
td { padding: 10px 12px; text-align: right; border-bottom: 1px solid #f0f4f8; }
td:first-child { text-align: left; font-weight: 500; }
tr:hover td { background: #f7fafc; }
input[type="number"] { width: 100%; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; text-align: right; }
input[type="number"]:focus { outline: none; border-color: #4299e1; }
.btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-primary { background: #4299e1; color: #fff; }
.btn-primary:hover { background: #3182ce; }
.btn-danger { background: #fc8181; color: #fff; }
.btn-danger:hover { background: #e53e3e; }
</style>
