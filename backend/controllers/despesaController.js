const jwt = require("jsonwebtoken");
const db = require('../config/db');
const Despesa = require('../models/despesaModel');

// ======================================
// 🔹 LISTAR TODAS AS DESPESAS
// ======================================
exports.listar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    const usuario_id = decoded.id;

    const sql = "SELECT * FROM despesas WHERE usuario_id = ?";
    db.query(sql, [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ message: err.sqlMessage });
      res.json(results);
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: "Token inválido" });
  }
};

// ======================================
// 🔹 BUSCAR DESPESA POR ID
// ======================================
exports.buscar = (req, res) => {
  const { id } = req.params;
  Despesa.buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    if (results.length === 0)
      return res.status(404).json({ message: 'Despesa não encontrada' });
    res.json(results[0]);
  });
};

// ======================================
// 🔹 CRIAR DESPESA (FORÇANDO DATA)
// ======================================
exports.criar = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seusegredoaqui');
    const usuario_id = decoded.id;
    const { descricao, categoria, valor, data_despesa } = req.body;

    // ✅ Usa STR_TO_DATE para forçar gravação literal da data
    const sql = `
      INSERT INTO despesas (descricao, categoria, valor, data_despesa, usuario_id)
      VALUES (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?)
    `;

    db.query(sql, [descricao, categoria, valor, data_despesa, usuario_id], (err) => {
      if (err) {
        console.error('❌ Erro ao criar despesa:', err);
        return res.status(500).json({ message: err.sqlMessage || 'Erro ao criar despesa' });
      }
      res.status(201).json({ message: '✅ Despesa adicionada com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: "Token inválido" });
  }
};

// ======================================
// 🔹 ATUALIZAR DESPESA
// ======================================
exports.atualizar = (req, res) => {
  const { id } = req.params;
  Despesa.atualizar(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });
    res.json({ message: 'Despesa atualizada com sucesso' });
  });
};

// ======================================
// 🔹 EXCLUIR DESPESA
// ======================================
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
