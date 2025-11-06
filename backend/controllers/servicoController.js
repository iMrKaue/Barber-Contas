// backend/controllers/servicoController.js
const Servico = require('../models/servicoModel');

exports.listar = (req, res) => {
  Servico.listarTodos((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.buscar = (req, res) => {
  const { id } = req.params;
  Servico.buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: 'Serviço não encontrado' });
    res.json(results[0]);
  });
};

exports.criar = (req, res) => {
  Servico.criar(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  Servico.atualizar(id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Serviço atualizado com sucesso' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Servico.excluir(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Serviço excluído com sucesso' });
  });
};
