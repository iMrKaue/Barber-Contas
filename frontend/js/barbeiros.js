// frontend/js/barbeiros.js


const form = document.getElementById("formBarbeiro");
const tabela = document.querySelector("#tabelaBarbeiros tbody");

// Carregar lista inicial
async function carregarBarbeiros() {
  try {
    const barbeiros = await apiFetch("/api/barbeiros");

    tabela.innerHTML = "";
    if (barbeiros && barbeiros.length > 0) {
      barbeiros.forEach((b) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${b.id}</td>
          <td>${b.nome}</td>
          <td>${b.email}</td>
          <td>${b.percentual_comissao}%</td>
          <td>${b.ativo ? "Ativo" : "Inativo"}</td>
          <td><button onclick="excluirBarbeiro(${b.id})">🗑️ Excluir</button></td>
        `;
        tabela.appendChild(linha);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar barbeiros:", error);
    alert("Erro ao carregar barbeiros: " + (error.message || "Erro desconhecido"));
  }
}


// Cadastrar novo barbeiro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const novo = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      ativo: document.getElementById("ativo").checked,
      percentual_comissao: parseFloat(document.getElementById("comissao").value),
    };

    await apiFetch("/api/barbeiros", {
      method: "POST",
      body: JSON.stringify(novo)
    });

    alert("Barbeiro cadastrado com sucesso!");
    form.reset();
    carregarBarbeiros();
  } catch (error) {
    console.error("Erro ao cadastrar barbeiro:", error);
    alert("Erro ao cadastrar barbeiro: " + (error.message || "Erro desconhecido"));
  }
});

// Excluir barbeiro
async function excluirBarbeiro(id) {
  if (confirm("Deseja realmente excluir este barbeiro?")) {
    await apiFetch(`/api/barbeiros/${id}`, { method: "DELETE" });
    alert("Barbeiro excluído com sucesso!");
    carregarBarbeiros();
  }
}

// Iniciar
carregarBarbeiros();
