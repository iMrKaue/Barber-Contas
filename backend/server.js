// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const barbeiroRoutes = require('./routes/barbeiroRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const vendaRoutes = require('./routes/vendaRoutes');
const despesaRoutes = require('./routes/despesaRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Configuração CORS completa
app.use(cors({
  origin: [
    'http://127.0.0.1:8080', // desenvolvimento local
    'http://localhost:8080', // VS Code Live Server
    'https://barber-contas.vercel.app', // domínio final da Vercel (produção)
    'https://barber-contas-git-master-kaues-projects-f3c020b1.vercel.app' // link de preview
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.send('API Barber Contas funcionando 🚀');
});

// Rotas
app.use('/api/barbeiros', barbeiroRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/vendas', vendaRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
