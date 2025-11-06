// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

// Resumo geral financeiro
router.get('/financeiro', relatorioController.resumo);

// Comissões por barbeiro
router.get('/comissoes', relatorioController.comissoes);

module.exports = router;
