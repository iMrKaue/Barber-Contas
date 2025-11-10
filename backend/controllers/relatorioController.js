// backend/controllers/relatorioController.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
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

exports.gerarRelatorioMensalPDF = (req, res) => {
  Relatorio.gerarRelatorioMensal(req.usuario_id, (err, results) => {
    if (err) return res.status(500).json({ message: "Erro ao gerar relatório", error: err });

    const dados = results[0];
    const lucroLiquido = dados.total_vendas - dados.total_despesas;

    const doc = new PDFDocument({ margin: 50 });
    const nomeArquivo = `relatorio_mensal_${Date.now()}.pdf`;
    const caminho = path.join(__dirname, `../temp/${nomeArquivo}`);

    doc.pipe(fs.createWriteStream(caminho));

    // Cabeçalho
    doc.fontSize(20).text("💈 Barber Contas - Relatório Mensal", { align: "center" });
    doc.moveDown();

    // Resumo financeiro
    doc.fontSize(14).text(`📅 Mês: ${new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`);
    doc.text(`💵 Total de Vendas: R$ ${dados.total_vendas.toFixed(2)}`);
    doc.text(`💸 Total de Despesas: R$ ${dados.total_despesas.toFixed(2)}`);
    doc.text(`🪙 Total de Comissões: R$ ${dados.total_comissoes.toFixed(2)}`);
    doc.text(`📈 Lucro Líquido: R$ ${lucroLiquido.toFixed(2)}`);
    doc.moveDown();

    doc.text("Relatório gerado automaticamente pelo sistema Barber Contas 💈", { align: "center" });

    doc.end();

    doc.on("finish", () => {
      res.download(caminho, nomeArquivo, () => {
        fs.unlinkSync(caminho); // exclui o PDF após o download
      });
    });
  });
};
