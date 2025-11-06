const db = require('../config/db');

const Barbeiro = {
  listarTodos: (callback) => {
    db.query('SELECT * FROM barbeiros', callback);
  },

  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM barbeiros WHERE id = ?', [id], callback);
  },

  criar: (dados, callback) => {
    const { nome, email, ativo, percentual_comissao } = dados;
    db.query(
      'INSERT INTO barbeiros (nome, email, ativo, percentual_comissao) VALUES (?, ?, ?, ?)',
      [nome, email, ativo, percentual_comissao],
      callback
    );
  },

  atualizar: (id, dados, callback) => {
    const { nome, email, ativo, percentual_comissao } = dados;
    db.query(
      'UPDATE barbeiros SET nome=?, email=?, ativo=?, percentual_comissao=? WHERE id=?',
      [nome, email, ativo, percentual_comissao, id],
      callback
    );
  },

  excluir: (id, callback) => {
    db.query('DELETE FROM barbeiros WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('❌ Erro ao excluir barbeiro:', err.sqlMessage);
        return callback(err);
      }
      console.log('✅ Barbeiro excluído:', id);
      callback(null, results);
    });
  },
};

module.exports = Barbeiro;
