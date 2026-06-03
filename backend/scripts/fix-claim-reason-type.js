const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixColumnType() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'claim_summarizer'
    });
    
    console.log("Connected to database 'claim_summarizer'.");
    
    // Change claim_reason from VARCHAR(255) to TEXT
    await connection.query(`
      ALTER TABLE claims 
      MODIFY COLUMN claim_reason TEXT;
    `);
    
    console.log("Successfully modified claim_reason column to TEXT.");
    
    await connection.end();
  } catch (error) {
    console.error("Failed to update database schema:", error);
  }
}

fixColumnType();
