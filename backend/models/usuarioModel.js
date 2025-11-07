// backend/models/usuarioModel.js
const db = require('../config/db');

const Usuario = {
  buscarPorEmail: (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },

  criar: (dados, callback) => {
    const { nome, email, senha, nivel } = dados;
    db.query(
      'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
      [nome, email, senha, nivel || 'barbeiro'],
      callback
    );
  }
};

module.exports = Usuario;
