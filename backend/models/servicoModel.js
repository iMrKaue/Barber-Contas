// backend/models/servicoModel.js
const db = require('../config/db');

const Servico = {
  listarTodos: (callback) => {
    db.query('SELECT * FROM servicos', callback);
  },

  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM servicos WHERE id = ?', [id], callback);
  },

  criar: (dados, callback) => {
    const { nome, preco_base } = dados;
    db.query(
      'INSERT INTO servicos (nome, preco_base) VALUES (?, ?)',
      [nome, preco_base],
      callback
    );
  },

  atualizar: (id, dados, callback) => {
    const { nome, preco_base } = dados;
    db.query(
      'UPDATE servicos SET nome=?, preco_base=? WHERE id=?',
      [nome, preco_base, id],
      callback
    );
  },

  excluir: (id, callback) => {
    db.query('DELETE FROM servicos WHERE id=?', [id], callback);
  },
};

module.exports = Servico;
