// backend/controllers/relatorioController.js
const Relatorio = require('../models/relatorioModel');

exports.resumo = (req, res) => {
  Relatorio.resumoFinanceiro((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

exports.comissoes = (req, res) => {
  Relatorio.comissaoPorBarbeiro((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
