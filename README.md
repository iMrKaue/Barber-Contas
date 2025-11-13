# 💈 Barber Contas — Sistema de Gestão Contábil para Barbearias

> Projeto desenvolvido como trabalho acadêmico na disciplina de Desenvolvimento de Sistemas.  
> Sistema **profissional de gestão financeira e operacional para barbearias**, com recursos modernos de controle de vendas, despesas, relatórios visuais e exportação de dados.

Link do Site - https://barber-contas.vercel.app/

Link do Vídeo -

---

## 🧭 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Banco de Dados](#-banco-de-dados)
- [API Endpoints](#-api-endpoints)
- [Deploy e Acesso Online](#-deploy-e-acesso-online)
- [Autor e Créditos](#-autor-e-créditos)
- [Licença](#-licença)

---

## 📘 Visão Geral

O **Barber Contas** é um sistema web completo para **gestão financeira e operacional de barbearias**.  
Permite o controle de **vendas, serviços, barbeiros, despesas, relatórios e caixa do dia**, tudo integrado a um painel moderno e responsivo.

A aplicação foi desenvolvida com foco em:
- ✅ **Organização contábil** — Controle total das finanças
- ✅ **Análise visual de resultados** — Dashboard com gráficos interativos
- ✅ **Usabilidade intuitiva** — Interface simples e moderna
- ✅ **Design profissional** — Layout inspirado em ERPs modernos
- ✅ **Notificações em tempo real** — Feedback visual instantâneo
- ✅ **Exportação de dados** — Relatórios em PDF e CSV

O projeto é totalmente funcional e pode ser usado como **base para implantação real** em pequenas empresas do ramo.

---

## 🧠 Tecnologias Utilizadas

### 🖥️ Frontend

- **HTML5** — Estrutura semântica das páginas
- **CSS3** — Design moderno e responsivo com tema profissional
- **JavaScript (ES6+)** — Interatividade e consumo de API REST
- **Chart.js** — Gráficos interativos para visualização de dados
- **Fetch API** — Comunicação com backend

### ⚙️ Backend

- **Node.js** — Runtime JavaScript
- **Express.js** — Framework web e rotas REST
- **MySQL** — Banco de dados relacional (hospedado no Railway)
- **JWT (JSON Web Token)** — Autenticação e autorização
- **Bcrypt** — Criptografia de senhas
- **PDFKit** — Geração de relatórios em PDF
- **json2csv** — Exportação de dados em CSV
- **Dotenv** — Configuração de variáveis de ambiente

### ☁️ Hospedagem

- **Render.com** — Backend em produção
- **Railway** — Banco de dados MySQL
- **Vercel** — Frontend (opcional)

---

## 🚀 Funcionalidades

| Módulo | Descrição | Finalidade |
|:-------|:-----------|:------------|
| 🔐 **Autenticação** | Login e cadastro de usuários | Segurança e isolamento de dados |
| 💈 **Cadastro de Barbeiros** | Gerencia os profissionais ativos | Organização interna e controle de comissões |
| 💆 **Serviços** | Lista e precifica os serviços prestados | Controle de preços e catálogo |
| 💵 **Vendas (Caixa)** | Registra e consulta vendas realizadas | Controle financeiro diário |
| 💸 **Despesas** | Registra custos e gastos da barbearia | Gestão contábil completa |
| 📊 **Dashboard** | Gráficos interativos de vendas, comissões e despesas | Visualização rápida dos lucros |
| 🧾 **Relatório PDF** | Gera resumo mensal completo em PDF | Impressão e contabilidade |
| ☁️ **Exportar CSV** | Exporta dados de vendas/despesas | Backup e transparência |
| 🔔 **Notificações Toast** | Exibir avisos com sucesso/erro | Feedback visual instantâneo |
| 📱 **Design Responsivo** | Layout adaptável para mobile e desktop | Acesso em qualquer dispositivo |

---

## 🧩 Estrutura do Projeto

```
barber-contas/
│
├── backend/
│   ├── config/
│   │   └── db.js              # Configuração do banco de dados
│   ├── controllers/
│   │   ├── authController.js  # Autenticação de usuários
│   │   ├── barbeiroController.js
│   │   ├── servicoController.js
│   │   ├── vendaController.js
│   │   ├── despesaController.js
│   │   └── relatorioController.js  # Relatórios e exportação
│   ├── models/
│   │   ├── usuarioModel.js
│   │   ├── barbeiroModel.js
│   │   ├── servicoModel.js
│   │   ├── vendaModel.js
│   │   ├── despesaModel.js
│   │   └── relatorioModel.js  # Queries de relatórios
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── barbeiroRoutes.js
│   │   ├── servicoRoutes.js
│   │   ├── vendaRoutes.js
│   │   ├── despesaRoutes.js
│   │   └── relatorioRoutes.js
│   ├── server.js              # Arquivo principal do servidor
│   ├── package.json           # Dependências do projeto
│   └── .env                   # Variáveis de ambiente
│
├── frontend/
│   ├── pages/
│   │   ├── login.html         # Tela de login e cadastro
│   │   ├── barbeiros.html     # Gestão de barbeiros
│   │   ├── servicos.html      # Gestão de serviços
│   │   ├── vendas.html        # Caixa do dia
│   │   ├── despesas.html      # Gestão de despesas
│   │   └── relatorios.html    # Dashboard e relatórios
│   ├── js/
│   │   ├── api.js             # Cliente HTTP para API
│   │   ├── toast.js           # Sistema de notificações
│   │   ├── barbeiros.js
│   │   ├── servicos.js
│   │   ├── vendas.js
│   │   ├── despesas.js
│   │   └── relatorios.js      # Lógica do dashboard
│   ├── css/
│   │   └── style.css          # Estilos globais e tema
│   ├── index.html             # Dashboard principal
│   └── README.md
│
└── README.md                  # Documentação principal
```

---

## ⚡ Como Executar o Projeto

### 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (local ou remoto)
- Git (opcional)

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/iMrKaue/Barber-Contas.git
cd barber-contas
```

### 🔹 2. Instalar as dependências

```bash
cd backend
npm install
```

### 🔹 3. Configurar o arquivo .env

Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte conteúdo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=suasenha
DB_NAME=barber_contas
JWT_SECRET=segredo_super_secreto_aqui
```

### 🔹 4. Configurar o banco de dados

O sistema criará automaticamente as tabelas necessárias na primeira execução.  
Certifique-se de que o banco de dados `barber_contas` existe:

```sql
CREATE DATABASE barber_contas;
```

### 🔹 5. Iniciar o servidor

```bash
npm start
```

O backend será iniciado em: **http://localhost:3000**

### 🔹 6. Abrir o frontend

Abra o arquivo `frontend/index.html` em um navegador ou use um servidor HTTP local:

```bash
# Usando Python
cd frontend
python -m http.server 8080

# Ou usando Node.js (http-server)
npx http-server frontend -p 8080
```

A interface web estará disponível em: **http://localhost:8080**

---

## 🗃️ Banco de Dados

O sistema utiliza **MySQL** com as seguintes tabelas principais:

### Tabelas

- **`usuarios`** — Usuários do sistema (login e autenticação)
- **`barbeiros`** — Cadastro de barbeiros e percentual de comissão
- **`servicos`** — Catálogo de serviços e preços
- **`vendas`** — Registro de vendas realizadas
- **`despesas`** — Registro de despesas e gastos

### Isolamento de Dados

Cada tabela está associada por `usuario_id`, garantindo **isolamento completo de dados** entre usuários diferentes. Isso permite que múltiplas barbearias usem o mesmo sistema sem interferência.

### Relacionamentos

- `vendas.barbeiro_id` → `barbeiros.id`
- `vendas.servico_id` → `servicos.id`
- Todas as tabelas → `usuarios.id` (via `usuario_id`)

---

## 🔌 API Endpoints

### Autenticação

- `POST /api/auth/register` — Cadastro de novo usuário
- `POST /api/auth/login` — Login e obtenção de token JWT

### Barbeiros

- `GET /api/barbeiros` — Listar todos os barbeiros
- `POST /api/barbeiros` — Cadastrar novo barbeiro
- `DELETE /api/barbeiros/:id` — Excluir barbeiro

### Serviços

- `GET /api/servicos` — Listar todos os serviços
- `POST /api/servicos` — Cadastrar novo serviço
- `DELETE /api/servicos/:id` — Excluir serviço

### Vendas

- `GET /api/vendas` — Listar todas as vendas
- `POST /api/vendas` — Registrar nova venda
- `DELETE /api/vendas/:id` — Excluir venda

### Despesas

- `GET /api/despesas` — Listar todas as despesas
- `POST /api/despesas` — Registrar nova despesa
- `DELETE /api/despesas/:id` — Excluir despesa

### Relatórios

- `GET /api/relatorios/financeiro` — Resumo financeiro geral
- `GET /api/relatorios/comissoes` — Comissões por barbeiro
- `GET /api/relatorios/vendas-periodo?dias=30` — Vendas por período
- `GET /api/relatorios/despesas-categoria` — Despesas por categoria
- `GET /api/relatorios/vendas-metodo` — Vendas por método de pagamento
- `GET /api/relatorios/mensal/pdf` — Gerar relatório mensal em PDF
- `GET /api/relatorios/exportar/:tipo` — Exportar dados em CSV (vendas ou despesas)

**Nota:** Todas as rotas (exceto `/api/auth/*`) requerem autenticação via token JWT no header:
```
Authorization: Bearer <token>
```

---

## 🌐 Deploy e Acesso Online

### 🚀 Backend

O projeto está hospedado no **Render.com**:
- 🔗 **URL:** https://barber-contas.onrender.com
- ⚙️ **Status:** Em produção
- 🔒 **Autenticação:** JWT

### 🗄️ Banco de Dados

Banco de dados MySQL hospedado via **Railway**:
- 🗄️ **Plataforma:** https://railway.app
- 💾 **Tipo:** MySQL
- 🔐 **Conexão:** Configurada via variáveis de ambiente

### 💻 Frontend

Frontend pode ser hospedado via **Vercel** (opcional):
- 🌐 **URL:** https://barber-contas.vercel.app
- 📦 **Deploy:** Automático via Git

---

## 📸 Funcionalidades em Destaque

### 💼 Dashboard Interativo

- Gráficos de vendas ao longo do tempo
- Comissões por barbeiro
- Despesas por categoria
- Distribuição financeira
- Vendas por método de pagamento
- Filtros de período (7, 30, 90, 365 dias)

### 🔔 Notificações Toast

- Feedback visual instantâneo
- Notificações de sucesso, erro, info e alerta
- Animações suaves e design moderno
- Fechamento automático ou manual

### 🧾 Relatórios

- **PDF Mensal:** Relatório completo do mês atual
- **CSV:** Exportação de vendas e despesas
- **Gráficos Interativos:** Visualização de dados em tempo real

---

## 👨‍💻 Autor e Créditos

👥 Equipe de Desenvolvimento

O projeto foi desenvolvido em equipe como parte da disciplina de Desenvolvimento de Sistemas, com colaboração ativa em todas as etapas — análise, design, codificação, testes e documentação.

Líder:
- Kauê Ferreira Macedo - RA - 924108818

Integrantes:
- João Vitor dos Santos                    RA - 924106044
- Marcos Vinicius Ferreira da Silva        RA - 924102932
- Diogo Expedito da Silva Oliveira         RA - 924106931
- Pietro Edaurdo Batista Aranha do Amaral  RA - 924111320
- Fabiano dos Santos Carvalho              RA - 924110969
- Kauan Lisboa da Silva                    RA - 924112062
- Gilverson Matuchaki Sousa                RA - 924105480

**Orientador:**

- Prof. Daniel Ferreira De Barros Jr — Faculdade Universidade Nove de Julho 

**Grupo:**

- 💈 **Grupo BigGym**

---

## 📄 Licença

Este projeto é de **uso acadêmico**, podendo ser adaptado para fins profissionais.  
Distribuído sob a **licença MIT**.

---

## 🔮 Melhorias Futuras

- [ ] Integração com PIX e pagamentos automáticos
- [ ] Módulo de agendamento de horários
- [ ] Dashboard com estatísticas semanais comparativas
- [ ] API pública com documentação Swagger
- [ ] App mobile (React Native)
- [ ] Sistema de backup automático
- [ ] Relatórios personalizados
- [ ] Integração com sistemas contábeis

---

## 💡 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- 🐛 Reportar bugs
- 💡 Sugerir melhorias
- 🔧 Enviar pull requests

---

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- 📧 Email: kaueferreira2020@hotmail.com
- 🐙 GitHub: [@iMrKaue](https://github.com/iMrKaue)

---

**💈 "Gestão inteligente para barbearias modernas — Barber Contas."**

