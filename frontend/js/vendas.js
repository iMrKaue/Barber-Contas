// frontend/js/vendas.js
const API_VENDAS = "http://localhost:3000/api/vendas";
const API_BARBEIROS = "http://localhost:3000/api/barbeiros";
const API_SERVICOS = "http://localhost:3000/api/servicos";

const form = document.getElementById("formVenda");
const tabela = document.querySelector("#tabelaVendas tbody");

// Preenche selects com barbeiros e serviços
async function carregarSelects() {
  const [barbeirosRes, servicosRes] = await Promise.all([
    fetch(API_BARBEIROS),
    fetch(API_SERVICOS),
  ]);

  const barbeiros = await barbeirosRes.json();
  const servicos = await servicosRes.json();

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
}

// Carrega lista de vendas
async function carregarVendas() {
  const res = await fetch(API_VENDAS);
  const vendas = await res.json();

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
}

// Registrar nova venda
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nova = {
    barbeiro_id: parseInt(document.getElementById("barbeiro").value),
    servico_id: parseInt(document.getElementById("servico").value),
    valor_bruto: parseFloat(document.getElementById("valor").value),
    metodo_pagamento: document.getElementById("metodo").value,
  };

  const res = await fetch(API_VENDAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nova),
  });

  if (res.ok) {
    alert("Venda registrada com sucesso!");
    form.reset();
    carregarVendas();
  } else {
    alert("Erro ao registrar venda.");
  }
});

// Excluir venda
async function excluirVenda(id) {
  if (confirm("Deseja realmente excluir esta venda?")) {
    const res = await fetch(`${API_VENDAS}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Venda excluída com sucesso!");
      carregarVendas();
    } else {
      alert("Erro ao excluir venda.");
    }
  }
}

// Inicializar
carregarSelects();
carregarVendas();
