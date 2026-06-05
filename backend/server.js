const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractText } = require('unpdf');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const db = require('./database');
const { analyzeClaim } = require('./geminiService');
const { authenticateToken, JWT_SECRET } = require('./auth');

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

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email and password (min 6 chars) are required.' });
    }

    // Check if user exists
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash password & save
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- CLAIM ROUTES ---

// GET endpoint for fetching user's claim history
app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // We only fetch claims that belong to this user. We also order by created_at DESC.
    const [claims] = await db.execute(
      'SELECT id, heading, claim_type, preview, claim_reason, coverage_summary, final_summary, gross_claim_amount, total_deductions, final_approved_amount, insured_liability, created_at FROM claims WHERE user_id = ? ORDER BY created_at DESC', 
      [userId]
    );
    res.json(claims);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

// POST endpoint for analyzing claim documents (Protected)
app.post('/api/analyze-claim', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    let documentText = '';

    // Check if text was provided directly
    if (req.body.text && req.body.text.trim().length > 0) {
      documentText = req.body.text;
    } 
    // Check if a PDF file was uploaded
    else if (req.file && req.file.mimetype === 'application/pdf') {
      try {
        // unpdf requires a Uint8Array, so we convert the multer Buffer
        const pdfData = await extractText(new Uint8Array(req.file.buffer));
        if (pdfData && typeof pdfData === 'object' && pdfData.text) {
          documentText = Array.isArray(pdfData.text) ? pdfData.text.join('\n') : pdfData.text;
        } else if (Array.isArray(pdfData)) {
          documentText = pdfData.join('\n');
        } else {
          documentText = typeof pdfData === 'string' ? pdfData : JSON.stringify(pdfData);
        }
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError);
        return res.status(400).json({ error: 'Failed to extract text from the PDF. The file might be corrupted or encrypted.' });
      }
    } else {
      return res.status(400).json({ error: 'Please provide either text or upload a PDF file.' });
    }

    if (!documentText || !documentText.trim()) {
      return res.status(400).json({ error: 'Extracted text is empty. Please provide a valid document.' });
    }

    // Normalization & Cleaning
    const normalizedText = documentText
      .replace(/\r\n/g, '\n') // Normalize newlines
      .replace(/[^\S\n]+/g, ' ') // Collapse horizontal whitespace, preserve newlines
      .replace(/(?<=\s)n(?=\d)/g, '₹') // Fix common currency extraction issues
      .replace(/\uFFFD/g, '') // Remove broken unicode replacement character
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove invalid/unprintable characters
      .trim();

    // Validate text length
    if (normalizedText.length < 20) {
      return res.status(400).json({ error: 'Extracted text is too short for meaningful analysis. Please provide a more detailed document.' });
    }

    const userId = req.user.id;
    
    // Normalize and Hash
    const documentHash = crypto.createHash('sha256').update(normalizedText).digest('hex');

    // Check for duplicate
    const [existingClaims] = await db.execute(
      'SELECT id, heading, claim_type, preview, claim_reason, coverage_summary, final_summary as summary, gross_claim_amount, total_deductions, final_approved_amount, insured_liability, created_at FROM claims WHERE document_hash = ? AND user_id = ?',
      [documentHash, userId]
    );

    if (existingClaims.length > 0) {
      const existingClaim = existingClaims[0];
      
      // Update the timestamp so it bumps to the top of the history page
      await db.execute('UPDATE claims SET created_at = CURRENT_TIMESTAMP WHERE id = ?', [existingClaim.id]);
      
      return res.json({
        cached: true,
        data: {
          ...existingClaim,
          created_at: new Date().toISOString()
        }
      });
    }

    // Call Gemini API to extract details (using cleaned text)
    const aiResult = await analyzeClaim(normalizedText);
    
    // Extract raw numbers safely
    const fb = aiResult.financial_breakdown || {};
    const grossClaim = Number(fb.gross_claim) || 0;
    const deductions = Number(fb.total_deductions) || 0;
    
    // Strict Backend Math Calculation (Rule-based numeric extraction layer)
    const finalAmount = Math.max(0, grossClaim - deductions);
    const liability = deductions;

    const query = `
      INSERT INTO claims (
        original_text, document_hash, heading, claim_type, preview, 
        claim_reason, coverage_summary, final_summary, user_id,
        gross_claim_amount, total_deductions, final_approved_amount, insured_liability
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [dbResult] = await db.execute(query, [
      normalizedText,
      documentHash,
      aiResult.heading || null,
      aiResult.claim_type || null,
      aiResult.preview || null,
      aiResult.claim_reason || null, 
      aiResult.coverage_summary || null, 
      aiResult.summary || null,
      userId,
      grossClaim,
      deductions,
      finalAmount,
      liability
    ]);

    // Return the response
    res.json({
      cached: false,
      data: {
        id: dbResult.insertId,
        ...aiResult,
        gross_claim_amount: grossClaim,
        total_deductions: deductions,
        final_approved_amount: finalAmount,
        insured_liability: liability
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze claim. Ensure your API key is correct and valid.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
