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
    recriarTabelaDespesas();
  }
});

// 🧱 Apaga e recria a tabela despesas com a estrutura correta
function recriarTabelaDespesas() {
  const drop = `DROP TABLE IF EXISTS despesas`;
  const create = `
    CREATE TABLE despesas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      descricao VARCHAR(100) NOT NULL,
      categoria VARCHAR(50),
      valor DECIMAL(10,2) NOT NULL,
      data_despesa DATE DEFAULT (CURRENT_DATE)
    )
  `;

  connection.query(drop, (err) => {
    if (err) console.error('Erro ao apagar tabela despesas:', err.sqlMessage);
    else {
      console.log('🗑️ Tabela antiga de despesas removida.');
      connection.query(create, (err2) => {
        if (err2) console.error('Erro ao criar nova tabela despesas:', err2.sqlMessage);
        else console.log('✅ Nova tabela despesas criada com sucesso!');
        criarOutrasTabelas();
      });
    }
  });
}

// 🧩 Cria as outras tabelas se não existirem
function criarOutrasTabelas() {
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
    `CREATE TABLE IF NOT EXISTS vendas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      barbeiro_id INT,
      servico_id INT,
      valor_bruto DECIMAL(10,2) NOT NULL,
      metodo_pagamento VARCHAR(50),
      comissao DECIMAL(10,2) DEFAULT 0.00,
      data_venda DATE DEFAULT (CURRENT_DATE),
      FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id),
      FOREIGN KEY (servico_id) REFERENCES servicos(id)
    )`
  ];

  tabelas.forEach((sql) => {
    connection.query(sql, (err) => {
      if (err) console.error('❌ Erro ao criar tabela:', err.sqlMessage);
      else console.log('✅ Tabela verificada/criada com sucesso.');
    });
  });
}

module.exports = connection;
