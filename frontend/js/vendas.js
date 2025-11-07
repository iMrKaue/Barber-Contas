// frontend/js/vendas.js
// Detecta se está rodando localmente ou online
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://barber-contas.onrender.com";
const API_VENDAS = `${API_BASE}/api/vendas`;
const API_BARBEIROS = `${API_BASE}/api/barbeiros`;
const API_SERVICOS = `${API_BASE}/api/servicos`;


const form = document.getElementById("formVenda");
const tabela = document.querySelector("#tabelaVendas tbody");

// Preenche selects com barbeiros e serviços
async function carregarSelects() {
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
}

// Carrega lista de vendas
async function carregarVendas() {
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
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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

  alert("Venda registrada com sucesso!");
  form.reset();
  carregarVendas();
});

// Excluir venda
async function excluirVenda(id) {
  if (confirm("Deseja realmente excluir esta venda?")) {
    await apiFetch(`/api/vendas/${id}`, { method: "DELETE" });
    alert("Venda excluída com sucesso!");
    carregarVendas();
  }
}

// Inicializar
carregarSelects();
carregarVendas();
