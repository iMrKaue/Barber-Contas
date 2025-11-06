const Barbeiro = require('../models/barbeiroModel');

exports.listar = (req, res) => {
  Barbeiro.listarTodos((err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json(results);
  });
};

exports.buscar = (req, res) => {
  const { id } = req.params;
  Barbeiro.buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    if (results.length === 0) return res.status(404).json({ message: 'Barbeiro não encontrado' });
    res.json(results[0]);
  });
};

exports.criar = (req, res) => {
  Barbeiro.criar(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  Barbeiro.atualizar(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json({ message: 'Barbeiro atualizado com sucesso' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Barbeiro.excluir(id, (err) => {
    if (err) {
      console.error('❌ Erro ao excluir barbeiro:', err.sqlMessage || err);
      return res.status(500).json({
        message: 'Erro ao excluir barbeiro',
        detalhe: err.sqlMessage || 'Erro interno do servidor',
      });
    }
    res.json({ message: 'Barbeiro excluído com sucesso' });
  });
};
