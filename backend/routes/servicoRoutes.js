// backend/routes/servicoRoutes.js
const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');

router.get('/', servicoController.listar);
router.get('/:id', servicoController.buscar);
router.post('/', servicoController.criar);
router.put('/:id', servicoController.atualizar);
router.delete('/:id', servicoController.excluir);

module.exports = router;
