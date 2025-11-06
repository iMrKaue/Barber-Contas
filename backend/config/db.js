require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.sqlMessage);
  } else {
    console.log('✅ Conectado ao MySQL (Railway)');
    criarTabelas(() => corrigirForeignKeys());
  }
});

// 🧱 Cria as tabelas caso ainda não existam
function criarTabelas(callback) {
  const tabelas = [
    `CREATE TABLE IF NOT EXISTS barbeiros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      ativo BOOLEAN DEFAULT true,
      percentual_comissao DECIMAL(5,2) DEFAULT 0.00
    )`,

    `CREATE TABLE IF NOT EXISTS servicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      preco_base DECIMAL(10,2) NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS despesas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      descricao VARCHAR(100) NOT NULL,
      categoria VARCHAR(50),
      valor DECIMAL(10,2) NOT NULL,
      data_despesa DATE DEFAULT (CURRENT_DATE)
    )`,

    `CREATE TABLE IF NOT EXISTS vendas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      barbeiro_id INT,
      servico_id INT,
      valor_bruto DECIMAL(10,2) NOT NULL,
      metodo_pagamento VARCHAR(50),
      comissao DECIMAL(10,2) DEFAULT 0.00,
      data_venda DATE DEFAULT (CURRENT_DATE)
    )`
  ];

  let pendentes = tabelas.length;
  tabelas.forEach((sql) => {
    connection.query(sql, (err) => {
      if (err) console.error('❌ Erro ao criar tabela:', err.sqlMessage);
      else console.log('✅ Tabela verificada/criada com sucesso.');
      if (--pendentes === 0 && callback) callback();
    });
  });
}

// ⚙️ Corrige automaticamente as foreign keys da tabela vendas
function corrigirForeignKeys() {
  console.log('🔍 Verificando e corrigindo foreign keys de vendas...');

  // 1️⃣ Primeiro, busca os nomes das FKs atuais
  const listarFKs = `
    SELECT CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_NAME = 'vendas' AND CONSTRAINT_SCHEMA = DATABASE()
      AND REFERENCED_TABLE_NAME IS NOT NULL;
  `;

  connection.query(listarFKs, (err, results) => {
    if (err) return console.error('Erro ao listar FKs:', err.sqlMessage);

    // 2️⃣ Remove todas as FKs encontradas
    const drops = results.map(r => `ALTER TABLE vendas DROP FOREIGN KEY \`${r.CONSTRAINT_NAME}\`;`).join(' ');
    if (drops) {
      connection.query(drops, (err2) => {
        if (err2) console.error('Erro ao remover FKs antigas:', err2.sqlMessage);
        else {
          console.log('🗑️ Foreign keys antigas removidas.');
          adicionarNovasFKs();
        }
      });
    } else {
      console.log('ℹ️ Nenhuma FK antiga encontrada, criando novas.');
      adicionarNovasFKs();
    }
  });
}

// 3️⃣ Recria as FKs com ON DELETE CASCADE
function adicionarNovasFKs() {
  const addFKs = `
    ALTER TABLE vendas
      ADD CONSTRAINT fk_vendas_barbeiros
        FOREIGN KEY (barbeiro_id)
        REFERENCES barbeiros(id)
        ON DELETE CASCADE,
      ADD CONSTRAINT fk_vendas_servicos
        FOREIGN KEY (servico_id)
        REFERENCES servicos(id)
        ON DELETE CASCADE;
  `;

  connection.query(addFKs, (err) => {
    if (err) console.error('⚠️ Erro ao adicionar novas FKs:', err.sqlMessage);
    else console.log('✅ Foreign keys corrigidas com ON DELETE CASCADE!');
  });
}


module.exports = connection;
