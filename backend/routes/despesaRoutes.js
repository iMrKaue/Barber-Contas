// backend/routes/despesaRoutes.js
const express = require('express');
const router = express.Router();
const despesaController = require('../controllers/despesaController');

router.get('/', despesaController.listar);
router.get('/:id', despesaController.buscar);
router.post('/', despesaController.criar);
router.put('/:id', despesaController.atualizar);
router.delete('/:id', despesaController.excluir);

module.exports = router;
