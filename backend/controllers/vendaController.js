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

exports.excluir = (req, res) => {
  const { id } = req.params;
  ModelName.excluir(id, (err, results) => {
    if (err) {
      console.error(`❌ Erro ao excluir ${ModelName.name}:`, err.sqlMessage || err);
      return res.status(500).json({
        message: `Erro ao excluir ${ModelName.name}`,
        detalhe: err.sqlMessage || 'Erro interno do servidor',
      });
    }
    res.json({ message: `${ModelName.name} excluído com sucesso` });
  });
};

