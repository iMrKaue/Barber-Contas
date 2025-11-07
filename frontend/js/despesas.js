// frontend/js/despesas.js
console.log("💸 Script despesas.js carregado!");
// Detecta se está rodando localmente ou online
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://barber-contas.onrender.com";
const API_DESPESAS = `${API_BASE}/api/despesas`;


const form = document.getElementById("formDespesa");
const tabela = document.querySelector("#tabelaDespesas tbody");

// Carregar lista de despesas
async function carregarDespesas() {
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
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nova = {
    descricao: document.getElementById("descricao").value,
    categoria: document.getElementById("categoria").value,
    valor: parseFloat(document.getElementById("valor").value),
    data_despesa: document.getElementById("data").value,
  };

  await apiFetch("/api/despesas", {
    method: "POST",
    body: JSON.stringify(nova)
  });

  alert("Despesa registrada com sucesso!");
  form.reset();
  carregarDespesas();
});

// Registrar nova despesa
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nova = {
    descricao: document.getElementById("descricao").value,
    categoria: document.getElementById("categoria").value,
    valor: parseFloat(document.getElementById("valor").value),
    data_despesa: document.getElementById("data").value,
  };

  const res = await fetch(API_DESPESAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nova),
  });

  if (res.ok) {
    alert("Despesa registrada com sucesso!");
    form.reset();
    carregarDespesas();
  } else {
    alert("Erro ao registrar despesa.");
  }
});

// Excluir despesa
async function excluirDespesa(id) {
  if (confirm("Deseja realmente excluir esta despesa?")) {
    await apiFetch(`/api/despesas/${id}`, { method: "DELETE" });
    alert("Despesa excluída com sucesso!");
    carregarDespesas();
  }
}

// Inicializar
carregarDespesas();
