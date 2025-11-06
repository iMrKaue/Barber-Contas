require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err);
  } else {
    console.log('✅ Conexão com MySQL (Railway) bem-sucedida!');
    criarTabelas();
  }
});

function criarTabelas() {
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
      valor DECIMAL(10,2) NOT NULL,
      data DATE DEFAULT (CURRENT_DATE)
    )`,
    `CREATE TABLE IF NOT EXISTS vendas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      barbeiro_id INT,
      servico_id INT,
      valor DECIMAL(10,2) NOT NULL,
      data DATE DEFAULT (CURRENT_DATE),
      FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id),
      FOREIGN KEY (servico_id) REFERENCES servicos(id)
    )`
  ];

  tabelas.forEach((sql) => {
    connection.query(sql, (err) => {
      if (err) console.error('Erro ao criar tabela:', err);
      else console.log('✅ Tabela verificada/criada com sucesso.');
    });
  });
}

module.exports = connection;
