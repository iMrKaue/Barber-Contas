// frontend/js/servicos.js


const form = document.getElementById("formServico");
const tabela = document.querySelector("#tabelaServicos tbody");

// Carrega os serviços
async function carregarServicos() {
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
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novo = {
    nome: document.getElementById("nome").value,
    preco_base: parseFloat(document.getElementById("preco").value),
  };

  await apiFetch("/api/servicos", {
    method: "POST",
    body: JSON.stringify(novo)
  });

  alert("Serviço cadastrado com sucesso!");
  form.reset();
  carregarServicos();
});

// Exclui um serviço
async function excluirServico(id) {
  if (confirm("Deseja realmente excluir este serviço?")) {
    await apiFetch(`/api/servicos/${id}`, { method: "DELETE" });
    alert("Serviço excluído com sucesso!");
    carregarServicos();
  }
}

// Inicializa a página
carregarServicos();
