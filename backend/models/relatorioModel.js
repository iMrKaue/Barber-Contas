// backend/models/relatorioModel.js
const db = require('../config/db');

const Relatorio = {
  resumoFinanceiro: (usuario_id, callback) => {
    // Fazer queries separadas e combinar os resultados
    const sqlVendas = 'SELECT COALESCE(SUM(valor_bruto), 0) AS total_vendas, COALESCE(SUM(comissao), 0) AS total_comissoes FROM vendas WHERE usuario_id = ?';
    const sqlDespesas = 'SELECT COALESCE(SUM(valor), 0) AS total_despesas FROM despesas WHERE usuario_id = ?';
    
    db.query(sqlVendas, [usuario_id], (errVendas, vendasResult) => {
      if (errVendas) {
        return callback(errVendas);
      }
      
      db.query(sqlDespesas, [usuario_id], (errDespesas, despesasResult) => {
        if (errDespesas) {
          return callback(errDespesas);
        }
        
        const totalVendas = vendasResult && vendasResult.length > 0 ? parseFloat(vendasResult[0].total_vendas || 0) : 0;
        const totalComissoes = vendasResult && vendasResult.length > 0 ? parseFloat(vendasResult[0].total_comissoes || 0) : 0;
        const totalDespesas = despesasResult && despesasResult.length > 0 ? parseFloat(despesasResult[0].total_despesas || 0) : 0;
        const lucroLiquido = totalVendas - totalComissoes - totalDespesas;
        
        callback(null, [{
          total_vendas: totalVendas,
          total_comissoes: totalComissoes,
          total_despesas: totalDespesas,
          lucro_liquido: lucroLiquido
        }]);
      });
    });
  },

  comissaoPorBarbeiro: (usuario_id, callback) => {
    const sql = `
      SELECT 
        b.nome AS barbeiro,
        COALESCE(SUM(v.comissao), 0) AS total_comissao,
        COALESCE(SUM(v.valor_bruto), 0) AS total_vendas
      FROM vendas v
      LEFT JOIN barbeiros b ON v.barbeiro_id = b.id
      WHERE v.usuario_id = ?
      GROUP BY b.id, b.nome
      ORDER BY total_comissao DESC
    `;
    db.query(sql, [usuario_id], callback);
  },  

  vendasPorPeriodo: (usuario_id, dias, callback) => {
    const sql = `
      SELECT 
        DATE(v.data_venda) AS data,
        COALESCE(SUM(v.valor_bruto), 0) AS total_vendas,
        COALESCE(SUM(v.comissao), 0) AS total_comissoes,
        COUNT(*) AS quantidade_vendas
      FROM vendas v
      WHERE v.usuario_id = ? AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(v.data_venda)
      ORDER BY data ASC
    `;
    db.query(sql, [usuario_id, dias], callback);
  },

  despesasPorCategoria: (usuario_id, callback) => {
    const sql = `
      SELECT 
        categoria,
        COALESCE(SUM(valor), 0) AS total
      FROM despesas
      WHERE usuario_id = ?
      GROUP BY categoria
      ORDER BY total DESC
    `;
  
    db.query(sql, [usuario_id], (err, results) => {
      if (err) {
        console.error("Erro ao buscar despesas por categoria:", err);
        return callback(err);
      }
  
      // Garante retorno válido mesmo se vazio
      if (!results || results.length === 0) {
        return callback(null, [{ categoria: "Sem despesas registradas", total: 0 }]);
      }
  
      callback(null, results);
    });
  },
  

  vendasPorMetodoPagamento: (usuario_id, callback) => {
    const sql = `
      SELECT 
        metodo_pagamento,
        COALESCE(SUM(valor_bruto), 0) AS total,
        COUNT(*) AS quantidade
      FROM vendas
      WHERE usuario_id = ?
      GROUP BY metodo_pagamento
      ORDER BY total DESC
    `;
    db.query(sql, [usuario_id], callback);
  },
};

module.exports = Relatorio;
