const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'users' verified/created.");

    // Alter claims table to add user_id safely
    try {
      await connection.query(`
        ALTER TABLE claims 
        ADD COLUMN user_id INT NULL,
        ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
      `);
      console.log("Successfully added 'user_id' column to 'claims'.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("Column 'user_id' already exists in 'claims'. Skipping.");
      } else {
        throw e;
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error("Failed to update database schema:", error);
  }
}

updateDatabase();
