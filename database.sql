CREATE DATABASE IF NOT EXISTS claim_summarizer;
USE claim_summarizer;

CREATE TABLE IF NOT EXISTS claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_text TEXT,
  claim_reason VARCHAR(255),
  coverage_summary TEXT,
  final_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
