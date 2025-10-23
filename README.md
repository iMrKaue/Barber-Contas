# 💈 Barber Contas – Sistema Contábil para Barbearia

## 🧾 Descrição do Projeto
O **Barber Contas** é um sistema web desenvolvido para auxiliar barbearias no controle financeiro e operacional do dia a dia.  
O sistema permite o **cadastro de barbeiros e serviços**, **lançamento de vendas com cálculo automático de comissão**, **registro de despesas** e **emissão de relatórios mensais consolidados**.

O objetivo é oferecer uma ferramenta simples e funcional para que o proprietário da barbearia acompanhe:
- o desempenho individual de cada barbeiro;
- o total de receitas, comissões e despesas;
- o lucro líquido mensal da barbearia.

---

## 🎯 Objetivo
Facilitar a **gestão financeira e contábil de barbearias**, centralizando informações e automatizando o cálculo de comissões e lucros, permitindo tomadas de decisão mais assertivas.

---

## 🧱 Funcionalidades Principais

### 1. Cadastro de Barbeiros
- Campos: nome, email, ativo/inativo, percentual de comissão.  
- Caso o barbeiro não possua percentual próprio, o sistema aplica a comissão padrão global.

### 2. Cadastro de Serviços
- Campos: nome do serviço, preço base.  
- Exemplos: corte simples, barba, corte + barba, sobrancelha, etc.

### 3. Lançamento de Vendas (Caixa do Dia)
- Seleção de barbeiro e serviço.  
- Inserção do valor bruto recebido.  
- Escolha do método de pagamento (dinheiro, cartão, pix).  
- Cálculo automático da comissão.  
- Registro da movimentação no banco de dados.

### 4. Despesas
- Registro de gastos fixos e variáveis:
  - Produtos (navalhete, lâmina, creme)
  - Taxas de cartão
  - Água, luz, aluguel
  - Outros ajustes

### 5. Relatórios
- Total de comissões por barbeiro.  
- Total de vendas e despesas mensais.  
- Lucro líquido consolidado.  
- Gráficos de receita e despesa (opcional).

---

## 💡 Exemplo de Fluxo Financeiro

| Etapa | Valor | Descrição |
|-------|--------|-----------|
| Venda | R$ 100,00 | Corte + Barba no cartão |
| Comissão (60%) | - R$ 60,00 | Barbeiro |
| Taxa cartão (3%) | - R$ 3,00 | Despesa variável |
| Produto (navalhete) | - R$ 2,00 | Despesa variável |
| 💰 Resultado líquido | **R$ 35,00** | Lucro da barbearia |

---

## ⚙️ Tecnologias Utilizadas

### Front-end
- HTML5  
- CSS3  
- JavaScript (ou React, caso o grupo opte por framework)

### Back-end
- Node.js  
- Express  
- Banco de Dados: PostgreSQL ou MySQL

### Hospedagem
- Front-end: **Vercel**  
- Back-end + Banco: **Render** ou **Railway**

### Controle de Versão
- Git / GitHub

---

## 🧩 Estrutura do Projeto

