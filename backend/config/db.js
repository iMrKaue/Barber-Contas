const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('✅ Conexão com PostgreSQL (Neon) bem-sucedida!'))
  .catch((err) => console.error('❌ Erro ao conectar ao PostgreSQL:', err));

module.exports = pool;
