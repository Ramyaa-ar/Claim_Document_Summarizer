const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractText } = require('unpdf');
require('dotenv').config();

const db = require('./database');
const { analyzeClaim } = require('./geminiService');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up multer for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Basic health check route
app.get('/', (req, res) => {
  res.send('Claim Document Summarizer API is running');
});

// POST endpoint for analyzing claim documents
app.post('/api/analyze-claim', upload.single('file'), async (req, res) => {
  try {
    let documentText = '';

    // Check if text was provided directly
    if (req.body.text && req.body.text.trim().length > 0) {
      documentText = req.body.text;
    } 
    // Check if a PDF file was uploaded
    else if (req.file && req.file.mimetype === 'application/pdf') {
      // unpdf requires a Uint8Array, so we convert the multer Buffer
      const pdfData = await extractText(new Uint8Array(req.file.buffer));
      if (pdfData && typeof pdfData === 'object' && pdfData.text) {
        documentText = Array.isArray(pdfData.text) ? pdfData.text.join('\n') : pdfData.text;
      } else if (Array.isArray(pdfData)) {
        documentText = pdfData.join('\n');
      } else {
        documentText = typeof pdfData === 'string' ? pdfData : JSON.stringify(pdfData);
      }
    } else {
      return res.status(400).json({ error: 'Please provide either text or upload a PDF file.' });
    }

    if (!documentText.trim()) {
      return res.status(400).json({ error: 'Extracted text is empty.' });
    }

    // Call Gemini API to extract details
    const aiResult = await analyzeClaim(documentText);

    // Save to MySQL database
    const query = `
      INSERT INTO claims (original_text, claim_reason, coverage_summary, final_summary)
      VALUES (?, ?, ?, ?)
    `;
    const [dbResult] = await db.execute(query, [
      documentText, 
      aiResult.claim_reason, 
      aiResult.coverage_summary, 
      aiResult.summary
    ]);

    // Return the response
    res.json({
      id: dbResult.insertId,
      ...aiResult
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze claim. Ensure your API key is correct and valid.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
