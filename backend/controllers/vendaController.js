const Venda = require('../models/vendaModel');

exports.listar = (req, res) => {
  Venda.listarTodas((err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json(results);
  });
};

exports.listarPorBarbeiro = (req, res) => {
  const { barbeiro_id } = req.params;
  Venda.listarPorBarbeiro(barbeiro_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json(results);
  });
};

exports.criar = (req, res) => {
  Venda.criar(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.status(201).json({ message: 'Venda registrada com sucesso!' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Venda.excluir(id, (err) => {
    if (err) {
      console.error('❌ Erro ao excluir venda:', err.sqlMessage || err);
      return res.status(500).json({
        message: 'Erro ao excluir venda',
        detalhe: err.sqlMessage || 'Erro interno do servidor',
      });
    }
    res.json({ message: 'Venda excluída com sucesso' });
  });
};
