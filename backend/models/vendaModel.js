const db = require('../config/db');

const Venda = {
  listarTodas: (callback) => {
    const sql = `
      SELECT 
        v.id,
        b.nome AS barbeiro,
        s.nome AS servico,
        v.valor_bruto,
        v.metodo_pagamento,
        v.comissao,
        v.data_venda
      FROM vendas v
      JOIN barbeiros b ON v.barbeiro_id = b.id
      JOIN servicos s ON v.servico_id = s.id
      ORDER BY v.data_venda DESC
      LIMIT 100
    `;
    db.query(sql, callback);
  },

  criar: (dados, callback) => {
    const { barbeiro_id, servico_id, valor_bruto, metodo_pagamento, usuario_id } = dados;

    const sqlComissao = 'SELECT percentual_comissao FROM barbeiros WHERE id = ? AND usuario_id = ?';
    db.query(sqlComissao, [barbeiro_id, usuario_id], (err, result) => {
      if (err) return callback(err);
      if (result.length === 0) return callback({ message: 'Barbeiro não encontrado' });

      const percentual = result[0].percentual_comissao;
      const comissao = (valor_bruto * percentual) / 100;

      const sqlInsert = `
        INSERT INTO vendas (barbeiro_id, servico_id, valor_bruto, metodo_pagamento, comissao, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(sqlInsert, [barbeiro_id, servico_id, valor_bruto, metodo_pagamento, comissao, usuario_id], callback);
    });
  },

  excluir: (id, callback) => {
    db.query('DELETE FROM vendas WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('❌ Erro ao excluir venda:', err.sqlMessage);
        return callback(err);
      }
      callback(null, results);
    });
  },

  listarPorBarbeiro: (barbeiro_id, callback) => {
    const sql = `
      SELECT 
        s.nome AS servico,
        v.valor_bruto,
        v.metodo_pagamento,
        v.comissao,
        v.data_venda
      FROM vendas v
      JOIN servicos s ON v.servico_id = s.id
      WHERE v.barbeiro_id = ?
      ORDER BY v.data_venda DESC
    `;
    db.query(sql, [barbeiro_id], callback);
  },

  // 🔹 Nova função correta (dentro do objeto)
  listarPorUsuario: (usuario_id, callback) => {
    db.query('SELECT * FROM vendas WHERE usuario_id = ?', [usuario_id], callback);
  },
};

module.exports = Venda;
