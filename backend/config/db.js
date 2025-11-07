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
  const barbeiros = `
    CREATE TABLE IF NOT EXISTS barbeiros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      ativo BOOLEAN DEFAULT true,
      percentual_comissao DECIMAL(5,2) DEFAULT 0.00
    )
  `;

  const servicos = `
    CREATE TABLE IF NOT EXISTS servicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      preco_base DECIMAL(10,2) NOT NULL
    )
  `;

  const vendas = `
    CREATE TABLE IF NOT EXISTS vendas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      barbeiro_id INT,
      servico_id INT,
      valor_bruto DECIMAL(10,2) NOT NULL,
      metodo_pagamento VARCHAR(50),
      comissao DECIMAL(10,2) DEFAULT 0.00,
      data_venda DATE DEFAULT (CURRENT_DATE),
      FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
    )
  `;

  // 🔹 Cria/verifica a tabela de usuários
  const sqlUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('admin', 'barbeiro') DEFAULT 'barbeiro',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

  connection.query(barbeiros, (err) => {
    if (err) return console.error('❌ Erro ao criar tabela barbeiros:', err.sqlMessage);
    console.log('✅ Tabela barbeiros criada/verificada.');

    connection.query(servicos, (err2) => {
      if (err2) return console.error('❌ Erro ao criar tabela servicos:', err2.sqlMessage);
      console.log('✅ Tabela servicos criada/verificada.');

      connection.query(vendas, (err3) => {
        if (err3) return console.error('❌ Erro ao criar tabela vendas:', err3.sqlMessage);
        console.log('✅ Tabela vendas criada/verificada (com FKs CASCADE).');

        connection.query(sqlUsuarios, (err) => {
          if (err) {
            console.error('❌ Erro ao criar/verificar tabela usuarios:', err.sqlMessage);
          } else {
            console.log('✅ Tabela usuarios criada/verificada.');
          }
        });
      });
    });
  });
}


module.exports = connection;
