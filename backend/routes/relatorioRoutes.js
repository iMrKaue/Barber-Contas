// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const jwt = require("jsonwebtoken");

// Middleware para verificar token em todas as rotas
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    req.usuario_id = decoded.id;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: "Token inválido" });
  }
};

// Aplicar middleware em todas as rotas
router.use(verificarToken);

// Resumo geral financeiro
router.get('/financeiro', relatorioController.resumo);

// Comissões por barbeiro
router.get('/comissoes', relatorioController.comissoes);

// Vendas por período
router.get('/vendas-periodo', relatorioController.vendasPorPeriodo);

// Despesas por categoria
router.get('/despesas-categoria', relatorioController.despesasPorCategoria);

// Vendas por método de pagamento
router.get('/vendas-metodo', relatorioController.vendasPorMetodoPagamento);

// Relatório mensal em PDF
router.get('/mensal/pdf', relatorioController.gerarRelatorioMensalPDF);

router.get("/exportar/:tipo", verificarToken, relatorioController.exportarCSV);

module.exports = router;
