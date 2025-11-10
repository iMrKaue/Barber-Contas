// frontend/js/servicos.js


const form = document.getElementById("formServico");
const tabela = document.querySelector("#tabelaServicos tbody");

// Carrega os serviços
async function carregarServicos() {
  try {
    const servicos = await apiFetch("/api/servicos");

    tabela.innerHTML = "";
    servicos.forEach((s) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${s.id}</td>
        <td>${s.nome}</td>
        <td>R$ ${parseFloat(s.preco_base).toFixed(2)}</td>
        <td><button onclick="excluirServico(${s.id})">🗑️ Excluir</button></td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    showError("Erro ao carregar serviços: " + (error.message || "Erro desconhecido"));
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const novo = {
      nome: document.getElementById("nome").value,
      preco_base: parseFloat(document.getElementById("preco").value),
    };

    await apiFetch("/api/servicos", {
      method: "POST",
      body: JSON.stringify(novo)
    });

    showSuccess("Serviço cadastrado com sucesso!");
    form.reset();
    carregarServicos();
  } catch (error) {
    console.error("Erro ao cadastrar serviço:", error);
    showError("Erro ao cadastrar serviço: " + (error.message || "Erro desconhecido"));
  }
});

// Exclui um serviço
async function excluirServico(id) {
  if (confirm("Deseja realmente excluir este serviço?")) {
    try {
      await apiFetch(`/api/servicos/${id}`, { method: "DELETE" });
      showSuccess("Serviço excluído com sucesso!");
      carregarServicos();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      showError("Erro ao excluir serviço: " + (error.message || "Erro desconhecido"));
    }
  }
}

// Inicializa a página
carregarServicos();
