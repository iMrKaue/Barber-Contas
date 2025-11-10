// frontend/js/vendas.js


const form = document.getElementById("formVenda");
const tabela = document.querySelector("#tabelaVendas tbody");

// Preenche selects com barbeiros e serviços
async function carregarSelects() {
  try {
    const [barbeiros, servicos] = await Promise.all([
      apiFetch("/api/barbeiros"),
      apiFetch("/api/servicos"),
    ]);

    const selectBarbeiro = document.getElementById("barbeiro");
    const selectServico = document.getElementById("servico");

    selectBarbeiro.innerHTML = '<option value="">Selecione o Barbeiro</option>';
    selectServico.innerHTML = '<option value="">Selecione o Serviço</option>';

    barbeiros.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = b.nome;
      selectBarbeiro.appendChild(opt);
    });

    servicos.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.nome;
      selectServico.appendChild(opt);
    });
  } catch (error) {
    console.error("Erro ao carregar selects:", error);
    showError("Erro ao carregar dados: " + (error.message || "Erro desconhecido"));
  }
}

// Carrega lista de vendas
async function carregarVendas() {
  try {
    const vendas = await apiFetch("/api/vendas");

    tabela.innerHTML = "";
    vendas.forEach((v) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${v.id}</td>
        <td>${v.barbeiro}</td>
        <td>${v.servico}</td>
        <td>R$ ${parseFloat(v.valor_bruto).toFixed(2)}</td>
        <td>R$ ${parseFloat(v.comissao).toFixed(2)}</td>
        <td>${v.metodo_pagamento}</td>
        <td>${new Date(v.data_venda).toLocaleDateString()}</td>
        <td><button onclick="excluirVenda(${v.id})">🗑️ Excluir</button></td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    console.error("Erro ao carregar vendas:", error);
    showError("Erro ao carregar vendas: " + (error.message || "Erro desconhecido"));
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const nova = {
      barbeiro_id: parseInt(document.getElementById("barbeiro").value),
      servico_id: parseInt(document.getElementById("servico").value),
      valor_bruto: parseFloat(document.getElementById("valor").value),
      metodo_pagamento: document.getElementById("metodo").value,
    };

    await apiFetch("/api/vendas", {
      method: "POST",
      body: JSON.stringify(nova)
    });

    showSuccess("Venda registrada com sucesso!");
    form.reset();
    carregarVendas();
  } catch (error) {
    showError("Erro ao registrar venda: " + (error.message || "Erro desconhecido"));
  }
});

// Excluir venda
async function excluirVenda(id) {
  if (confirm("Deseja realmente excluir esta venda?")) {
    try {
      await apiFetch(`/api/vendas/${id}`, { method: "DELETE" });
      showSuccess("Venda excluída com sucesso!");
      carregarVendas();
    } catch (error) {
      showError("Erro ao excluir venda: " + (error.message || "Erro desconhecido"));
    }
  }
}

// Inicializar
carregarSelects();
carregarVendas();
