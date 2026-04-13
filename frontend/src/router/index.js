import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/DashboardView.vue') },
    { path: '/entradas', component: () => import('../views/EntradasView.vue') },
    { path: '/saidas', component: () => import('../views/SaidasView.vue') },
    { path: '/faturacao', component: () => import('../views/FaturacaoView.vue') },
    { path: '/resultados', component: () => import('../views/ResultadosView.vue') },
    { path: '/fluxo', component: () => import('../views/FluxoCaixaView.vue') },
    { path: '/alertas', component: () => import('../views/AlertasView.vue') },
  ],
})

export default router
