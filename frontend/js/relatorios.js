// frontend/js/relatorios.js - Dashboard completo com múltiplos gráficos

let periodoAtual = 30; // Padrão: 30 dias
let charts = {}; // Armazenar instâncias dos gráficos

// Inicializar dashboard
document.addEventListener("DOMContentLoaded", () => {
  configurarFiltros();
  carregarDashboard();
});

// Configurar botões de filtro
function configurarFiltros() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove classe active de todos
      filterButtons.forEach(b => b.classList.remove("active"));
      // Adiciona classe active no botão clicado
      btn.classList.add("active");
      // Atualiza período
      periodoAtual = parseInt(btn.dataset.dias);
      // Recarrega dashboard
      carregarDashboard();
    });
  });
}

// Carregar todos os dados do dashboard
async function carregarDashboard() {
  try {
    if (typeof showInfo === 'function') {
      showInfo("Carregando dados do dashboard...");
    }
    
    console.log("📊 Carregando dados do dashboard...");
    
    // Verificar se há token
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar logado para acessar o dashboard");
    }
    
    // Carregar todos os dados em paralelo
    const [resumo, comissoes, vendasPeriodo, despesasCategoria, vendasMetodo] = await Promise.all([
      apiFetch("/api/relatorios/financeiro").catch(err => {
        console.error("Erro ao carregar resumo:", err);
        return { total_vendas: 0, total_comissoes: 0, total_despesas: 0, lucro_liquido: 0 };
      }),
      apiFetch("/api/relatorios/comissoes").catch(err => {
        console.error("Erro ao carregar comissões:", err);
        return [];
      }),
      apiFetch(`/api/relatorios/vendas-periodo?dias=${periodoAtual}`).catch(err => {
        console.error("Erro ao carregar vendas por período:", err);
        return [];
      }),
      apiFetch("/api/relatorios/despesas-categoria").catch(err => {
        console.error("Erro ao carregar despesas por categoria:", err);
        return [];
      }),
      apiFetch("/api/relatorios/vendas-metodo").catch(err => {
        console.error("Erro ao carregar vendas por método:", err);
        return [];
      })
    ]);

    console.log("✅ Dados carregados:", { resumo, comissoes, vendasPeriodo, despesasCategoria, vendasMetodo });

    // Atualizar cards de resumo
    atualizarResumo(resumo);

    // Criar/atualizar gráficos (garantir que são arrays)
    criarGraficoVendasTempo(Array.isArray(vendasPeriodo) ? vendasPeriodo : []);
    criarGraficoComissoesBarbeiro(Array.isArray(comissoes) ? comissoes : []);
    criarGraficoDespesasCategoria(Array.isArray(despesasCategoria) ? despesasCategoria : []);
    criarGraficoFinanceiro(resumo);
    criarGraficoMetodoPagamento(Array.isArray(vendasMetodo) ? vendasMetodo : []);

    console.log("✅ Dashboard carregado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao carregar dashboard:", error);
    const errorMessage = error.message || "Erro desconhecido ao carregar dados";
    
    if (typeof showError === 'function') {
      showError("Erro ao carregar dashboard: " + errorMessage);
    } else {
      alert("Erro ao carregar dashboard: " + errorMessage);
    }
    
    // Mostrar dados vazios em caso de erro
    atualizarResumo({ total_vendas: 0, total_comissoes: 0, total_despesas: 0, lucro_liquido: 0 });
    criarGraficoVendasTempo([]);
    criarGraficoComissoesBarbeiro([]);
    criarGraficoDespesasCategoria([]);
    criarGraficoFinanceiro({ total_vendas: 0, total_comissoes: 0, total_despesas: 0, lucro_liquido: 0 });
    criarGraficoMetodoPagamento([]);
  }
}

// Atualizar cards de resumo
function atualizarResumo(dados) {
  const totalVendas = parseFloat(dados.total_vendas || 0);
  const totalComissoes = parseFloat(dados.total_comissoes || 0);
  const totalDespesas = parseFloat(dados.total_despesas || 0);
  const lucroLiquido = parseFloat(dados.lucro_liquido || 0);

  document.getElementById("totalVendas").textContent = `R$ ${totalVendas.toFixed(2)}`;
  document.getElementById("totalComissoes").textContent = `R$ ${totalComissoes.toFixed(2)}`;
  document.getElementById("totalDespesas").textContent = `R$ ${totalDespesas.toFixed(2)}`;
  document.getElementById("lucroLiquido").textContent = `R$ ${lucroLiquido.toFixed(2)}`;
}

// Gráfico de vendas ao longo do tempo
function criarGraficoVendasTempo(dados) {
  const ctx = document.getElementById("graficoVendasTempo");
  if (!ctx) return;
  
  // Destruir gráfico anterior se existir
  if (charts.vendasTempo) {
    charts.vendasTempo.destroy();
  }

  // Se não houver dados, criar gráfico vazio
  if (!dados || dados.length === 0) {
    dados = [{ data: new Date().toISOString().split('T')[0], total_vendas: 0, total_comissoes: 0 }];
  }

  // Formatar datas
  const labels = dados.map(item => {
    const date = new Date(item.data + 'T00:00:00');
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  });

  charts.vendasTempo = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Vendas (R$)",
          data: dados.map(item => parseFloat(item.total_vendas || 0)),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true
        },
        {
          label: "Comissões (R$)",
          data: dados.map(item => parseFloat(item.total_comissoes || 0)),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return "R$ " + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Gráfico de comissões por barbeiro
function criarGraficoComissoesBarbeiro(dados) {
  const ctx = document.getElementById("graficoComissoesBarbeiro");
  if (!ctx) return;
  
  if (charts.comissoesBarbeiro) {
    charts.comissoesBarbeiro.destroy();
  }

  // Se não houver dados, criar gráfico vazio
  if (!dados || dados.length === 0) {
    dados = [{ barbeiro: "Nenhum dado", total_comissao: 0, total_vendas: 0 }];
  }

  charts.comissoesBarbeiro = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dados.map(item => item.barbeiro || "N/A"),
      datasets: [
        {
          label: "Comissões (R$)",
          data: dados.map(item => parseFloat(item.total_comissao || 0)),
          backgroundColor: "#3b82f6"
        },
        {
          label: "Vendas (R$)",
          data: dados.map(item => parseFloat(item.total_vendas || 0)),
          backgroundColor: "#10b981"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return "R$ " + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Gráfico de despesas por categoria
function criarGraficoDespesasCategoria(dados) {
  const ctx = document.getElementById("graficoDespesasCategoria");
  if (!ctx) return;
  
  if (charts.despesasCategoria) {
    charts.despesasCategoria.destroy();
  }

  // Se não houver dados, criar gráfico vazio
  if (!dados || dados.length === 0) {
    dados = [{ categoria: "Nenhuma despesa", total: 0 }];
  }

  // Cores para o gráfico
  const cores = [
    "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
  ];

  charts.despesasCategoria = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: dados.map(item => item.categoria || "Sem categoria"),
      datasets: [
        {
          label: "Despesas (R$)",
          data: dados.map(item => parseFloat(item.total || 0)),
          backgroundColor: cores.slice(0, dados.length)
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              return label + ": R$ " + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Gráfico de distribuição financeira
function criarGraficoFinanceiro(dados) {
  const ctx = document.getElementById("graficoFinanceiro");
  if (!ctx) return;
  
  if (charts.financeiro) {
    charts.financeiro.destroy();
  }

  // Garantir que dados existem
  if (!dados) {
    dados = { total_comissoes: 0, total_despesas: 0, lucro_liquido: 0 };
  }

  const totalComissoes = parseFloat(dados.total_comissoes || 0);
  const totalDespesas = parseFloat(dados.total_despesas || 0);
  const lucroLiquido = parseFloat(dados.lucro_liquido || 0);

  charts.financeiro = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Comissões", "Despesas", "Lucro Líquido"],
      datasets: [
        {
          label: "Distribuição Financeira",
          data: [totalComissoes, totalDespesas, lucroLiquido],
          backgroundColor: ["#ef4444", "#f59e0b", "#10b981"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              return label + ": R$ " + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Gráfico de vendas por método de pagamento
function criarGraficoMetodoPagamento(dados) {
  const ctx = document.getElementById("graficoMetodoPagamento");
  if (!ctx) return;
  
  if (charts.metodoPagamento) {
    charts.metodoPagamento.destroy();
  }

  // Se não houver dados, criar gráfico vazio
  if (!dados || dados.length === 0) {
    dados = [{ metodo_pagamento: "Nenhum dado", total: 0, quantidade: 0 }];
  }

  // Traduzir métodos de pagamento
  const traduzirMetodo = (metodo) => {
    const traducao = {
      "dinheiro": "Dinheiro",
      "cartao": "Cartão",
      "pix": "PIX"
    };
    return traducao[metodo] || metodo;
  };

  charts.metodoPagamento = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dados.map(item => traduzirMetodo(item.metodo_pagamento || "N/A")),
      datasets: [
        {
          label: "Total em Vendas (R$)",
          data: dados.map(item => parseFloat(item.total || 0)),
          backgroundColor: "#8b5cf6"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const index = context.dataIndex;
              const quantidade = dados[index].quantidade || 0;
              return `Quantidade: ${quantidade} venda(s)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return "R$ " + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Aguardar carregamento completo da página
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    configurarFiltros();
    carregarDashboard();
  });
} else {
  configurarFiltros();
  carregarDashboard();
}
