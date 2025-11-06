console.log("📊 Script relatorios.js carregado!");

const API_RELATORIOS = "http://localhost:3000/api/relatorios/financeiro";

async function carregarResumo() {
  try {
    const res = await fetch(API_RELATORIOS);
    const dadosBrutos = await res.json();

    console.log("📦 Dados recebidos:", dadosBrutos);

    // Normaliza as chaves (remove acentos) e converte vírgulas em ponto
    const dados = {
      total_vendas: parseFloat(String(dadosBrutos.total_vendas).replace(",", ".")) || 0,
      total_comissoes: parseFloat(
        String(dadosBrutos.total_comissoes || dadosBrutos["total_comissões"]).replace(",", ".")
      ) || 0,
      total_despesas: parseFloat(String(dadosBrutos.total_despesas).replace(",", ".")) || 0,
      lucro_liquido: parseFloat(
        String(dadosBrutos.lucro_liquido || dadosBrutos["lucro_líquido"]).replace(",", ".")
      ) || 0,
    };

    // Atualiza os cards
    document.getElementById("totalVendas").textContent = `R$ ${dados.total_vendas.toFixed(2)}`;
    document.getElementById("totalComissoes").textContent = `R$ ${dados.total_comissoes.toFixed(2)}`;
    document.getElementById("totalDespesas").textContent = `R$ ${dados.total_despesas.toFixed(2)}`;
    document.getElementById("lucroLiquido").textContent = `R$ ${dados.lucro_liquido.toFixed(2)}`;

    gerarGrafico(dados);
  } catch (error) {
    console.error("Erro ao carregar relatório:", error);
  }
}

function gerarGrafico(dados) {
  const ctx = document.getElementById("graficoFinanceiro");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Comissões", "Despesas", "Lucro Líquido"],
      datasets: [
        {
          label: "Distribuição Financeira",
          data: [dados.total_comissoes, dados.total_despesas, dados.lucro_liquido],
          backgroundColor: ["#ff6384", "#ffce56", "#36a2eb"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

carregarResumo();
