import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

const EMPRESA_ID = 1;
const ANO = 2025;

export const dashboardService = {
  get: () => api.get('/dashboard', { params: { empresa_id: EMPRESA_ID, ano: ANO } }),
};

export const entradasService = {
  get: () => api.get('/entradas', { params: { empresa_id: EMPRESA_ID, ano: ANO } }),
  upsert: (data) => api.put('/entradas', { empresa_id: EMPRESA_ID, ano: ANO, ...data }),
};

export const saidasService = {
  get: () => api.get('/saidas', { params: { empresa_id: EMPRESA_ID, ano: ANO } }),
  upsert: (data) => api.put('/saidas', { empresa_id: EMPRESA_ID, ano: ANO, ...data }),
};

export const faturacaoService = {
  get: () => api.get('/faturas', { params: { empresa_id: EMPRESA_ID } }),
  create: (data) => api.post('/faturas', { empresa_id: EMPRESA_ID, ...data }),
  update: (id, data) => api.put(`/faturas/${id}`, data),
  delete: (id) => api.delete(`/faturas/${id}`),
};

export const alertasService = {
  get: () => api.get('/alertas', { params: { empresa_id: EMPRESA_ID, ano: ANO } }),
};
