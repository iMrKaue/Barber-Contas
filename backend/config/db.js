require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.sqlMessage);
  } else {
    console.log('✅ Conectado ao MySQL (Railway)');
    // Define o charset da conexão para UTF-8
    connection.query('SET NAMES utf8mb4', (err) => {
      if (err) console.error('❌ Erro ao definir charset:', err.sqlMessage);
      else console.log('✅ Charset UTF-8 definido');
    });
    criarTabelasComUsuarioId();
  }
});

// 🧩 Cria todas as tabelas com usuario_id
function criarTabelasComUsuarioId() {
  // Primeiro cria a tabela de usuários (precisa existir primeiro para as FKs)
  const sqlUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      nivel ENUM('admin', 'barbeiro') DEFAULT 'barbeiro',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.query(sqlUsuarios, (err) => {
    if (err) {
      console.error('❌ Erro ao criar/verificar tabela usuarios:', err.sqlMessage);
    } else {
      console.log('✅ Tabela usuarios criada/verificada.');
      adicionarColunaUsuarioId();
    }
  });
}

// 🔧 Adiciona coluna usuario_id nas tabelas existentes (se não existir)
function adicionarColunaUsuarioId() {
  const tabelas = ['barbeiros', 'servicos', 'vendas', 'despesas'];
  let completas = 0;

  tabelas.forEach((tabela) => {
    // Verifica se a coluna já existe
    const checkColumn = `
      SELECT COUNT(*) as existe 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tabela}' 
      AND COLUMN_NAME = 'usuario_id'
    `;

    connection.query(checkColumn, (err, results) => {
      if (err) {
        console.error(`❌ Erro ao verificar coluna usuario_id em ${tabela}:`, err.sqlMessage);
        completas++;
        if (completas === tabelas.length) criarTabelasAtualizadas();
      } else {
        const existe = results[0].existe > 0;
        
        if (!existe) {
          // Primeiro adiciona a coluna (sem constraint)
          const addColumn = `ALTER TABLE ${tabela} ADD COLUMN usuario_id INT`;
          
          connection.query(addColumn, (err2) => {
            if (err2) {
              console.error(`❌ Erro ao adicionar coluna usuario_id em ${tabela}:`, err2.sqlMessage);
              completas++;
              if (completas === tabelas.length) criarTabelasAtualizadas();
            } else {
              console.log(`✅ Coluna usuario_id adicionada em ${tabela}`);
              
              // Depois adiciona a foreign key
              const fkName = `fk_${tabela}_usuario_id`;
              const addFK = `
                ALTER TABLE ${tabela} 
                ADD CONSTRAINT ${fkName} 
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
              `;
              
              connection.query(addFK, (err3) => {
                if (err3) {
                  // Se a FK já existe ou há erro, apenas loga (não é crítico)
                  console.log(`⚠️ Aviso ao adicionar FK em ${tabela}:`, err3.sqlMessage);
                } else {
                  console.log(`✅ Foreign key adicionada em ${tabela}`);
                }
                completas++;
                if (completas === tabelas.length) criarTabelasAtualizadas();
              });
            }
          });
        } else {
          console.log(`✅ Coluna usuario_id já existe em ${tabela}`);
          completas++;
          if (completas === tabelas.length) criarTabelasAtualizadas();
        }
      }
    });
  });
}

// 🧩 Cria as tabelas atualizadas com usuario_id (se não existirem)
function criarTabelasAtualizadas() {
  const barbeiros = `
    CREATE TABLE IF NOT EXISTS barbeiros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      ativo BOOLEAN DEFAULT true,
      percentual_comissao DECIMAL(5,2) DEFAULT 60.00,
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  const servicos = `
    CREATE TABLE IF NOT EXISTS servicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      preco_base DECIMAL(10,2) NOT NULL,
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
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
      usuario_id INT,
      FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  const despesas = `
    CREATE TABLE IF NOT EXISTS despesas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      descricao VARCHAR(100) NOT NULL,
      categoria VARCHAR(50),
      valor DECIMAL(10,2) NOT NULL,
      data_despesa DATE DEFAULT (CURRENT_DATE),
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.query(barbeiros, (err) => {
    if (err) console.error('❌ Erro ao criar tabela barbeiros:', err.sqlMessage);
    else console.log('✅ Tabela barbeiros criada/verificada.');

    connection.query(servicos, (err2) => {
      if (err2) console.error('❌ Erro ao criar tabela servicos:', err2.sqlMessage);
      else console.log('✅ Tabela servicos criada/verificada.');

      connection.query(vendas, (err3) => {
        if (err3) console.error('❌ Erro ao criar tabela vendas:', err3.sqlMessage);
        else console.log('✅ Tabela vendas criada/verificada.');

        connection.query(despesas, (err4) => {
          if (err4) console.error('❌ Erro ao criar tabela despesas:', err4.sqlMessage);
          else console.log('✅ Tabela despesas criada/verificada.');
        });
      });
    });
  });
}


module.exports = connection;
