// backend/models/relatorioModel.js
const db = require('../config/db');

const Relatorio = {
  resumoFinanceiro: (callback) => {
    const sql = `
      SELECT 
        COALESCE(SUM(v.valor_bruto), 0) AS total_vendas,
        COALESCE(SUM(v.comissao), 0) AS total_comissoes,
        COALESCE((SELECT SUM(d.valor) FROM despesas d), 0) AS total_despesas,
        (COALESCE(SUM(v.valor_bruto), 0) - COALESCE(SUM(v.comissao), 0) - COALESCE((SELECT SUM(d.valor) FROM despesas d), 0)) AS lucro_liquido
      FROM vendas v
    `;
    db.query(sql, callback);
  },

  comissaoPorBarbeiro: (callback) => {
    const sql = `
      SELECT 
        b.nome AS barbeiro,
        SUM(v.comissao) AS total_comissao,
        SUM(v.valor_bruto) AS total_vendas
      FROM vendas v
      JOIN barbeiros b ON v.barbeiro_id = b.id
      GROUP BY b.id
      ORDER BY total_comissao DESC
    `;
    db.query(sql, callback);
  },
};

module.exports = Relatorio;
