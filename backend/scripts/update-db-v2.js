const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'claim_summarizer'
    });
    
    console.log("Connected to database 'claim_summarizer'.");
    
    // Check existing columns to avoid errors if run multiple times
    const [columns] = await connection.query(`SHOW COLUMNS FROM claims LIKE 'heading'`);
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE claims 
        ADD COLUMN heading VARCHAR(255) DEFAULT NULL,
        ADD COLUMN claim_type VARCHAR(100) DEFAULT NULL,
        ADD COLUMN preview TEXT DEFAULT NULL;
      `);
      console.log("Successfully added heading, claim_type, and preview to claims table.");
    } else {
      console.log("Columns already exist.");
    }
    
    // Add document_hash for deduplication
    const [hashColumns] = await connection.query(`SHOW COLUMNS FROM claims LIKE 'document_hash'`);
    if (hashColumns.length === 0) {
      await connection.query(`
        ALTER TABLE claims 
        ADD COLUMN document_hash VARCHAR(64) DEFAULT NULL;
      `);
      console.log("Successfully added document_hash to claims table.");
    } else {
      console.log("document_hash column already exists.");
    }
    
    await connection.end();
  } catch (error) {
    console.error("Failed to update database schema:", error);
  }
}

updateDatabase();
