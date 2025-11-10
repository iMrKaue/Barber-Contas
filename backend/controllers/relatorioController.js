// backend/controllers/relatorioController.js
const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv"); 
const Relatorio = require('../models/relatorioModel');

// Função helper para formatar data em português
function formatarDataPTBR(data) {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  return `${meses[data.getMonth()]} de ${data.getFullYear()}`;
}

function formatarDataCompleta(data) {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const hora = data.getHours().toString().padStart(2, '0');
  const minuto = data.getMinutes().toString().padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

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
  console.log("🧾 Iniciando geração do PDF para usuário:", req.usuario_id);

  try {
    Relatorio.gerarRelatorioMensal(req.usuario_id, (err, results) => {
      if (err) {
        console.error("❌ Erro no SQL do relatório:", err);
        return res.status(500).json({ 
          message: "Erro ao gerar relatório: " + (err.sqlMessage || err.message || "Erro desconhecido"),
          error: err 
        });
      }

      const dados = results && results.length > 0 && results[0] 
        ? results[0] 
        : { total_vendas: 0, total_despesas: 0, total_comissoes: 0 };
      
      const totalVendas = parseFloat(dados.total_vendas || 0);
      const totalDespesas = parseFloat(dados.total_despesas || 0);
      const totalComissoes = parseFloat(dados.total_comissoes || 0);
      const lucroLiquido = totalVendas - totalComissoes - totalDespesas;

      console.log("📊 Dados do relatório:", { totalVendas, totalDespesas, totalComissoes, lucroLiquido });

      // Configurar headers para PDF
      const nomeArquivo = `relatorio_mensal_${new Date().getTime()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);

      // Criar PDF e enviar diretamente para a resposta
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      doc.pipe(res);

      // Tratamento de erros do PDF
      doc.on('error', (err) => {
        console.error("❌ Erro ao gerar PDF:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Erro ao gerar PDF: " + err.message });
        }
      });

      // Título
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text("Barber Contas", { align: "center" });
      doc.fontSize(16)
         .text("Relatorio Mensal", { align: "center" });
      doc.moveDown(2);

      // Data
      const agora = new Date();
      const mesAno = formatarDataPTBR(agora);
      doc.fontSize(14)
         .font('Helvetica')
         .text(`Periodo: ${mesAno.charAt(0).toUpperCase() + mesAno.slice(1)}`, { align: "left" });
      doc.moveDown();

      // Valores
      doc.fontSize(12);
      doc.text(`Total de Vendas: R$ ${totalVendas.toFixed(2)}`, { indent: 20 });
      doc.text(`Total de Comissoes: R$ ${totalComissoes.toFixed(2)}`, { indent: 20 });
      doc.text(`Total de Despesas: R$ ${totalDespesas.toFixed(2)}`, { indent: 20 });
      doc.moveDown();
      
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text(`Lucro Liquido: R$ ${lucroLiquido.toFixed(2)}`, { indent: 20 });
      doc.moveDown(3);

      // Rodapé
      doc.fontSize(10)
         .font('Helvetica')
         .text("Relatorio gerado automaticamente pelo sistema Barber Contas", { align: "center" });
      doc.text(`Gerado em: ${formatarDataCompleta(agora)}`, { align: "center" });

      // Finalizar PDF
      doc.end();

      console.log("✅ PDF gerado e enviado com sucesso!");
    });
  } catch (e) {
    console.error("🔥 Erro inesperado:", e);
    res.status(500).json({ 
      message: "Erro interno no servidor: " + (e.message || "Erro desconhecido"),
      error: e.message 
    });
  }
};

// === Exportar dados de vendas e despesas em CSV (compatível com Render) ===
exports.exportarCSV = (req, res) => {
  const tipo = req.params.tipo; // 'vendas' ou 'despesas'
  const usuarioId = req.usuario_id;

  console.log("☁️ Solicitado backup CSV do tipo:", tipo);

  let sql = "";
  if (tipo === "vendas") {
    sql = `
      SELECT v.id, b.nome AS barbeiro, s.nome AS servico, v.valor_bruto, v.comissao, 
             v.metodo_pagamento, DATE_FORMAT(v.data_venda, "%d/%m/%Y") AS data_venda
      FROM vendas v
      LEFT JOIN barbeiros b ON v.barbeiro_id = b.id
      LEFT JOIN servicos s ON v.servico_id = s.id
      WHERE v.usuario_id = ?
      ORDER BY v.data_venda DESC
    `;
  } else if (tipo === "despesas") {
    sql = `
      SELECT d.id, d.descricao, d.categoria, d.valor, 
             DATE_FORMAT(d.data_despesa, "%d/%m/%Y") AS data_despesa
      FROM despesas d
      WHERE d.usuario_id = ?
      ORDER BY d.data_despesa DESC
    `;
  } else {
    return res.status(400).json({ message: "Tipo inválido. Use 'vendas' ou 'despesas'." });
  }

  db.query(sql, [usuarioId], (err, rows) => {
    if (err) {
      console.error("❌ Erro ao exportar CSV:", err);
      return res.status(500).json({ message: "Erro ao exportar CSV", error: err });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Nenhum dado encontrado." });
    }

    try {
      const parser = new Parser();
      const csv = parser.parse(rows);

      // salva temporariamente no diretório /tmp (Render permite isso)
      const nomeArquivo = `${tipo}_backup_${Date.now()}.csv`;
      const caminho = path.join("/tmp", nomeArquivo);

      fs.writeFileSync(caminho, csv);

      // envia o arquivo para download e depois remove
      res.download(caminho, nomeArquivo, (erro) => {
        if (erro) console.error("❌ Erro ao enviar CSV:", erro);
        try {
          fs.unlinkSync(caminho);
        } catch (e) {
          console.warn("⚠️ Não foi possível remover o CSV temporário:", e.message);
        }
      });

      console.log(`✅ Backup de ${tipo} exportado com sucesso (${rows.length} registros)`);
    } catch (error) {
      console.error("❌ Erro ao gerar CSV:", error);
      res.status(500).json({ message: "Erro ao gerar CSV", error });
    }
  });
};
