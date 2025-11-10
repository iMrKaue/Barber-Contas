// backend/controllers/relatorioController.js
const Relatorio = require('../models/relatorioModel');

// Todas as rotas já têm o middleware de autenticação aplicado nas rotas
// req.usuario_id está disponível através do middleware

exports.resumo = (req, res) => {
  Relatorio.resumoFinanceiro(req.usuario_id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar resumo financeiro:', err);
      return res.status(500).json({ 
        message: err.sqlMessage || err.message || 'Erro ao buscar resumo financeiro',
        error: err 
      });
    }
    // Garantir que sempre retorna um objeto, mesmo se não houver resultados
    const resumo = results && results.length > 0 ? results[0] : {
      total_vendas: 0,
      total_comissoes: 0,
      total_despesas: 0,
      lucro_liquido: 0
    };
    res.json(resumo);
  });
};

exports.comissoes = (req, res) => {
  Relatorio.comissaoPorBarbeiro(req.usuario_id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar comissões:', err);
      return res.status(500).json({ 
        message: err.sqlMessage || err.message || 'Erro ao buscar comissões',
        error: err 
      });
    }
    res.json(results || []);
  });
};

exports.vendasPorPeriodo = (req, res) => {
  const dias = parseInt(req.query.dias) || 30;
  Relatorio.vendasPorPeriodo(req.usuario_id, dias, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas por período:', err);
      return res.status(500).json({ 
        message: err.sqlMessage || err.message || 'Erro ao buscar vendas por período',
        error: err 
      });
    }
    res.json(results || []);
  });
};

exports.despesasPorCategoria = (req, res) => {
  Relatorio.despesasPorCategoria(req.usuario_id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar despesas por categoria:', err);
      return res.status(500).json({ 
        message: err.sqlMessage || err.message || 'Erro ao buscar despesas por categoria',
        error: err 
      });
    }
    res.json(results || []);
  });
};

exports.vendasPorMetodoPagamento = (req, res) => {
  Relatorio.vendasPorMetodoPagamento(req.usuario_id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas por método:', err);
      return res.status(500).json({ 
        message: err.sqlMessage || err.message || 'Erro ao buscar vendas por método de pagamento',
        error: err 
      });
    }
    res.json(results || []);
  });
};
