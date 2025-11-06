// frontend/js/servicos.js
// Detecta se está rodando localmente ou online
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://barber-contas.onrender.com";

const API_URL = `${API_BASE}/api/servicos`;


const form = document.getElementById("formServico");
const tabela = document.querySelector("#tabelaServicos tbody");

// Carrega os serviços
async function carregarServicos() {
  const res = await fetch(API_URL);
  const servicos = await res.json();

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

// Cadastra um novo serviço
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novo = {
    nome: document.getElementById("nome").value,
    preco_base: parseFloat(document.getElementById("preco").value),
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novo),
  });

  if (res.ok) {
    alert("Serviço cadastrado com sucesso!");
    form.reset();
    carregarServicos();
  } else {
    alert("Erro ao cadastrar serviço.");
  }
});

// Exclui um serviço
async function excluirServico(id) {
  if (confirm("Deseja realmente excluir este serviço?")) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Serviço excluído com sucesso!");
      carregarServicos();
    } else {
      alert("Erro ao excluir serviço.");
    }
  }
}

// Inicializa a página
carregarServicos();
