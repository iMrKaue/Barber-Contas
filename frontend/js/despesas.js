// frontend/js/despesas.js
console.log("💸 Script despesas.js carregado!");

// Referências dos elementos da página
const form = document.getElementById("formDespesa");
const tabela = document.querySelector("#tabelaDespesas tbody");

// ===============================
// 🔹 Carregar lista de despesas
// ===============================
async function carregarDespesas() {
  try {
    const despesas = await apiFetch("/api/despesas");

    tabela.innerHTML = "";
    despesas.forEach((d) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${d.id}</td>
        <td>${d.descricao}</td>
        <td>${d.categoria}</td>
        <td>R$ ${parseFloat(d.valor).toFixed(2)}</td>
        <td>${new Date(d.data_despesa).toLocaleDateString()}</td>
        <td><button onclick="excluirDespesa(${d.id})">🗑️ Excluir</button></td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    console.error("Erro ao carregar despesas:", error);
    showError("Erro ao carregar despesas: " + (error.message || "Erro desconhecido"));
  }
}

// =====================================
// 🔹 Adicionar nova despesa (corrigido)
// =====================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // Captura a data como string pura, sem usar new Date()
    const dataInput = document.getElementById("data").value;

    // Cria o objeto da nova despesa
    const nova = {
      descricao: document.getElementById("descricao").value,
      categoria: document.getElementById("categoria").value,
      valor: parseFloat(document.getElementById("valor").value),
      data_despesa: dataInput // <-- envia a string exata
    };

    await apiFetch("/api/despesas", {
      method: "POST",
      body: JSON.stringify(nova)
    });

    showSuccess("Despesa registrada com sucesso!");
    form.reset();
    carregarDespesas();
  } catch (error) {
    console.error("Erro ao registrar despesa:", error);
    showError("Erro ao registrar despesa: " + (error.message || "Erro desconhecido"));
  }
});


// ===============================
// 🔹 Excluir despesa
// ===============================
async function excluirDespesa(id) {
  if (confirm("Deseja realmente excluir esta despesa?")) {
    try {
      await apiFetch(`/api/despesas/${id}`, { method: "DELETE" });
      showSuccess("Despesa excluída com sucesso!");
      carregarDespesas();
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      showError("Erro ao excluir despesa: " + (error.message || "Erro desconhecido"));
    }
  }
}

// ===============================
// 🔹 Inicializar ao carregar
// ===============================
carregarDespesas();
