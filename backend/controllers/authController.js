// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Usuario = require('../models/usuarioModel');

const JWT_SECRET = process.env.JWT_SECRET || 'seusegredoaqui';

// Validações
exports.validate = (method) => {
  switch (method) {
    case 'register':
      return [
        body('nome').notEmpty().withMessage('Nome obrigatório'),
        body('email').isEmail().withMessage('Email inválido'),
        body('senha').isLength({ min: 4 }).withMessage('Senha deve ter 4+ caracteres'),
      ];
    case 'login':
      return [
        body('email').isEmail().withMessage('Email inválido'),
        body('senha').notEmpty().withMessage('Senha obrigatória'),
      ];
  }
};

// Registro de novo usuário
exports.register = (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) return res.status(400).json({ errors: erros.array() });

  const { nome, email, senha, nivel } = req.body;

  // Verifica se já existe
  Usuario.buscarPorEmail(email, async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    Usuario.criar({ nome, email, senha: hash, nivel }, (err2, results2) => {
      if (err2) return res.status(500).json({ message: err2.sqlMessage });
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    });
  });
};

// Login
exports.login = (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.status(400).json({ errors: erros.array() });
  
    const { email, senha } = req.body;
  
    Usuario.buscarPorEmail(email, async (err, results) => {
      if (err) {
        console.error("❌ Erro ao buscar usuário:", err.sqlMessage || err);
        return res.status(500).json({ message: "Erro interno ao buscar usuário" });
      }
  
      // 🧩 Se não achou nenhum usuário
      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      const usuario = results[0];
  
      // 🧩 Se o campo 'senha' estiver ausente por algum motivo
      if (!usuario.senha) {
        console.error("⚠️ Usuário encontrado, mas sem senha cadastrada:", usuario);
        return res.status(400).json({ message: "Usuário inválido (sem senha cadastrada)" });
      }
  
      // 🧩 Verifica senha
      const match = await bcrypt.compare(senha, usuario.senha);
      if (!match) return res.status(401).json({ message: 'Senha incorreta' });
  
      // 🧩 Gera o token
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, nivel: usuario.nivel },
        JWT_SECRET,
        { expiresIn: "365d" }
      );      
  
      res.json({ message: 'Login bem-sucedido', token });
    });
  };
  
