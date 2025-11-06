// backend/routes/barbeiroRoutes.js
const express = require('express');
const router = express.Router();
const barbeiroController = require('../controllers/barbeiroController');

router.get('/', barbeiroController.listar);
router.get('/:id', barbeiroController.buscar);
router.post('/', barbeiroController.criar);
router.put('/:id', barbeiroController.atualizar);
router.delete('/:id', barbeiroController.excluir);

module.exports = router;
