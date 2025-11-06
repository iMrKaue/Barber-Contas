// backend/routes/vendaRoutes.js
const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');

router.get('/', vendaController.listar);
router.get('/barbeiro/:barbeiro_id', vendaController.listarPorBarbeiro);
router.post('/', vendaController.criar);
router.delete('/:id', vendaController.excluir);

module.exports = router;
