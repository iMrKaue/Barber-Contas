const jwt = require("jsonwebtoken");
const db = require('../config/db');
const Servico = require('../models/servicoModel');

exports.listar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    const usuario_id = decoded.id;

    const sql = "SELECT * FROM servicos WHERE usuario_id = ?";
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
  Servico.buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    if (results.length === 0)
      return res.status(404).json({ message: 'Serviço não encontrado' });
    res.json(results[0]);
  });
};

exports.criar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    const usuario_id = decoded.id;
    const { nome, preco_base } = req.body;

    const sql = `
      INSERT INTO servicos (nome, preco_base, usuario_id)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [nome, preco_base, usuario_id], (err, result) => {
      if (err) {
        console.error('Erro ao criar serviço:', err);
        return res.status(500).json({ message: err.sqlMessage || 'Erro ao criar serviço' });
      }
      res.status(201).json({ message: 'Serviço criado com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: "Token inválido" });
  }
};


exports.atualizar = (req, res) => {
  const { id } = req.params;
  Servico.atualizar(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json({ message: 'Serviço atualizado com sucesso' });
  });
};

exports.excluir = (req, res) => {
  const { id } = req.params;
  Servico.excluir(id, (err) => {
    if (err) {
      console.error('❌ Erro ao excluir serviço:', err.sqlMessage || err);
      return res.status(500).json({
        message: 'Erro ao excluir serviço',
        detalhe: err.sqlMessage || 'Erro interno do servidor',
      });
    }
    res.json({ message: 'Serviço excluído com sucesso' });
  });
};
