const Despesa = require('../models/despesaModel');

exports.listar = (req, res) => {
  Despesa.listarTodas((err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json(results);
  });
};

exports.buscar = (req, res) => {
  const { id } = req.params;
  Despesa.buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    if (results.length === 0)
      return res.status(404).json({ message: 'Despesa não encontrada' });
    res.json(results[0]);
  });
};

exports.criar = (req, res) => {
  Despesa.criar(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  Despesa.atualizar(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json({ message: 'Despesa atualizada com sucesso' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Despesa.excluir(id, (err) => {
    if (err) {
      console.error('❌ Erro ao excluir despesa:', err.sqlMessage || err);
      return res.status(500).json({
        message: 'Erro ao excluir despesa',
        detalhe: err.sqlMessage || 'Erro interno do servidor',
      });
    }
    res.json({ message: 'Despesa excluída com sucesso' });
  });
};
