const express = require('express');
const router = express.Router();

const { getDashboard } = require('../controllers/dashboardController');
const { getEntradas, upsertEntrada } = require('../controllers/entradasController');
const { getSaidas, upsertSaida } = require('../controllers/saidasController');
const { getFaturas, createFatura, updateFatura, deleteFatura } = require('../controllers/faturacaoController');
const { getAlertas } = require('../controllers/alertasController');

router.get('/dashboard', getDashboard);

router.get('/entradas', getEntradas);
router.put('/entradas', upsertEntrada);

router.get('/saidas', getSaidas);
router.put('/saidas', upsertSaida);

router.get('/faturas', getFaturas);
router.post('/faturas', createFatura);
router.put('/faturas/:id', updateFatura);
router.delete('/faturas/:id', deleteFatura);

router.get('/alertas', getAlertas);

module.exports = router;
