const jwt = require("jsonwebtoken");
const db = require('../config/db');
const Barbeiro = require('../models/barbeiroModel');

exports.listar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    const usuario_id = decoded.id;

    const sql = "SELECT * FROM barbeiros WHERE usuario_id = ?";
    db.query(sql, [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ message: err.sqlMessage });
      res.json(results);
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: "Token inválido" });
  }
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
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    const usuario_id = decoded.id;
    const { nome, email, percentual_comissao, ativo } = req.body;

    const sql = `
      INSERT INTO barbeiros (nome, email, percentual_comissao, ativo, usuario_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [nome, email, percentual_comissao || 60, ativo !== undefined ? ativo : true, usuario_id], (err, result) => {
      if (err) {
        console.error('Erro ao criar barbeiro:', err);
        return res.status(500).json({ message: err.sqlMessage || 'Erro ao criar barbeiro' });
      }
      res.status(201).json({ message: 'Barbeiro criado com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: "Token inválido" });
  }
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
