const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS claim_summarizer;');
    console.log("Database 'claim_summarizer' created successfully.");
    
    await connection.query('USE claim_summarizer;');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS claims (
        id INT AUTO_INCREMENT PRIMARY KEY,
        original_text TEXT,
        claim_reason VARCHAR(255),
        coverage_summary TEXT,
        final_summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'claims' created successfully.");
    
    await connection.end();
  } catch (error) {
    console.error("Failed to create database:", error);
  }
}

createDatabase();
