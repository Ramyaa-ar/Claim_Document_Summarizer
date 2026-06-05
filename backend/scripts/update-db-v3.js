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
    const [columns] = await connection.query(`SHOW COLUMNS FROM claims LIKE 'gross_claim_amount'`);
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE claims 
        ADD COLUMN gross_claim_amount DECIMAL(15, 2) DEFAULT NULL,
        ADD COLUMN total_deductions DECIMAL(15, 2) DEFAULT NULL,
        ADD COLUMN final_approved_amount DECIMAL(15, 2) DEFAULT NULL,
        ADD COLUMN insured_liability DECIMAL(15, 2) DEFAULT NULL;
      `);
      console.log("Successfully added financial breakdown columns to claims table.");
    } else {
      console.log("Financial breakdown columns already exist.");
    }
    
    await connection.end();
  } catch (error) {
    console.error("Failed to update database schema:", error);
  }
}

updateDatabase();
