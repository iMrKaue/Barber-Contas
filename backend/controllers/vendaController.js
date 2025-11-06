// backend/controllers/vendaController.js
const Venda = require('../models/vendaModel');

exports.listar = (req, res) => {
  Venda.listarTodas((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.criar = (req, res) => {
  Venda.criar(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Venda registrada com sucesso!' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Venda.excluir(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Venda excluída com sucesso' });
  });
};

exports.listarPorBarbeiro = (req, res) => {
  const { barbeiro_id } = req.params;
  Venda.listarPorBarbeiro(barbeiro_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
