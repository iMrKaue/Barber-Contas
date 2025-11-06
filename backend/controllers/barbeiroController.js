// backend/controllers/barbeiroController.js
const Barbeiro = require('../models/barbeiroModel');

exports.listar = (req, res) => {
  Barbeiro.listarTodos((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.buscar = (req, res) => {
  const { id } = req.params;
  Barbeiro.buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Barbeiro não encontrado' });
    res.json(results[0]);
  });
};

exports.criar = (req, res) => {
  Barbeiro.criar(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  Barbeiro.atualizar(id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Barbeiro atualizado com sucesso' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Barbeiro.excluir(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Barbeiro excluído com sucesso' });
  });
};
