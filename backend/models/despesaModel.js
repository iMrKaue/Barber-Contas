// backend/models/despesaModel.js
const db = require('../config/db');

const Despesa = {
  listarTodas: (callback) => {
    db.query('SELECT * FROM despesas ORDER BY data_despesa DESC', callback);
  },

  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM despesas WHERE id = ?', [id], callback);
  },

  criar: (dados, callback) => {
    const { descricao, categoria, valor, data_despesa } = dados;
    db.query(
      'INSERT INTO despesas (descricao, categoria, valor, data_despesa) VALUES (?, ?, ?, ?)',
      [descricao, categoria, valor, data_despesa],
      callback
    );
  },

  atualizar: (id, dados, callback) => {
    const { descricao, categoria, valor, data_despesa } = dados;
    db.query(
      'UPDATE despesas SET descricao=?, categoria=?, valor=?, data_despesa=? WHERE id=?',
      [descricao, categoria, valor, data_despesa, id],
      callback
    );
  },

  excluir: (id, callback) => {
    db.query('DELETE FROM despesas WHERE id = ?', [id], callback);
  },
};

module.exports = Despesa;
