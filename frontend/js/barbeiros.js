// frontend/js/barbeiros.js
const API_URL = "http://localhost:3000/api/barbeiros";

const form = document.getElementById("formBarbeiro");
const tabela = document.querySelector("#tabelaBarbeiros tbody");

// Carregar lista inicial
async function carregarBarbeiros() {
  const res = await fetch(API_URL);
  const barbeiros = await res.json();

  tabela.innerHTML = "";
  barbeiros.forEach((b) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${b.id}</td>
      <td>${b.nome}</td>
      <td>${b.email}</td>
      <td>${b.percentual_comissao}%</td>
      <td>${b.ativo ? "Ativo" : "Inativo"}</td>
      <td>
        <button onclick="excluirBarbeiro(${b.id})">🗑️ Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Cadastrar novo barbeiro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novo = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    ativo: document.getElementById("ativo").checked,
    percentual_comissao: parseFloat(document.getElementById("comissao").value),
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novo),
  });

  if (res.ok) {
    alert("Barbeiro cadastrado com sucesso!");
    form.reset();
    carregarBarbeiros();
  } else {
    alert("Erro ao cadastrar barbeiro.");
  }
});

// Excluir barbeiro
async function excluirBarbeiro(id) {
  if (confirm("Deseja realmente excluir este barbeiro?")) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Barbeiro excluído com sucesso!");
      carregarBarbeiros();
    } else {
      alert("Erro ao excluir barbeiro.");
    }
  }
}

// Iniciar
carregarBarbeiros();
