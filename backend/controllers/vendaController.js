const jwt = require("jsonwebtoken");
const Venda = require('../models/vendaModel');

exports.listar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario_id = decoded.id;

    Venda.listarPorUsuario(usuario_id, (err, results) => {
      if (err) return res.status(500).json({ message: err.sqlMessage });
      res.json(results);
    });
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};

exports.listarPorBarbeiro = (req, res) => {
  const { barbeiro_id } = req.params;
  Venda.listarPorBarbeiro(barbeiro_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json(results);
  });
};

exports.criar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario_id = decoded.id;

    Venda.criar({ ...req.body, usuario_id }, (err, result) => {
      if (err) return res.status(500).json({ message: err.sqlMessage });
      res.status(201).json({ message: "Venda criada com sucesso" });
    });
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
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

