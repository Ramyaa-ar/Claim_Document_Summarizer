const jwt = require('jsonwebtoken');

// A default secret if not provided in .env (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'claim_summarizer_super_secret_key_123';

function authenticateToken(req, res, next) {
  // Get token from Authorization header (format: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token, we can just proceed without user_id (for unassigned claims)
    // Or we can block it. The user wants protected routes, so we block it.
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
}

module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  JWT_SECRET
};
