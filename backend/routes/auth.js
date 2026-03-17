import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import initDB from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';
let db;

// Simple in-memory token blacklist for logout
const tokenBlacklist = new Set();

initDB().then((database) => {
  db = database;
}).catch(console.error);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const id = uuidv4();

    db.run(
      'INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)',
      [id, username, hash, new Date().toISOString()],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        // Auto-login on register: return a token
        const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'User registered successfully', token, user: { id, username } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  tokenBlacklist.add(token);
  res.json({ message: 'Logged out successfully' });
});

// Middleware to protect routes (required auth)
export function protect(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been invalidated. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
}

// Middleware for optional auth (extracts user if token present, but doesn't require it)
export function optionalAuth(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token || tokenBlacklist.has(token)) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }
  next();
}

export default router;
