import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import initDB from '../db.js';
import { protect, optionalAuth } from './auth.js';

const router = Router();
let db;

initDB().then((database) => {
  db = database;
}).catch(console.error);

// Helper: convert market string to numeric value for ranking
const marketToNumeric = (market) => {
  const map = { 'Very High': 5, 'High': 4, 'Medium': 3, 'Low': 2, 'Very Low': 1 };
  return map[market] || 1;
};

// GET /api/ideas - List active (non-expired) ideas with filters, ranking, and visibility
router.get('/', optionalAuth, (req, res) => {
  try {
    const { search, category, difficulty, market, sort = 'ranking', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const currentUserId = req.user ? req.user.id : null;

    let query = `
      SELECT id, title, description, problem, category, difficulty, market, votes, userId, visibility, expiryDate, viewCount, createdAt, updatedAt
      FROM ideas
    `;
    let params = [];
    let conditions = [];

    const now = new Date().toISOString();

    // Visibility: show 'active' ideas that are NOT expired
    // OR show the user's own ideas regardless of visibility/expiry
    let visibilityCondition = `(visibility = 'active' AND (expiryDate IS NULL OR expiryDate > ?))`;
    params.push(now);

    if (currentUserId) {
      visibilityCondition += ` OR userId = ?`;
      params.push(currentUserId);
    }

    conditions.push(`(${visibilityCondition})`);

    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ? OR problem LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (difficulty && difficulty !== 'All') {
      conditions.push('difficulty = ?');
      params.push(parseInt(difficulty));
    }
    if (market && market !== 'All') {
      conditions.push('market = ?');
      params.push(market);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ranking formula from spec: (Market Potential × 2) + Difficulty Score + Upvotes
    // Market is stored as text, so we use a CASE expression to convert it
    const rankingExpression = `(
      (CASE market
        WHEN 'Very High' THEN 5
        WHEN 'High' THEN 4
        WHEN 'Medium' THEN 3
        WHEN 'Low' THEN 2
        WHEN 'Very Low' THEN 1
        ELSE 1
      END * 2) + difficulty + votes
    )`;

    if (sort === 'popular') {
      query += ' ORDER BY votes DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY createdAt DESC';
    } else { // default is ranking
      query += ` ORDER BY ${rankingExpression} DESC, createdAt DESC`;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ideas/archived - List expired ideas (Archived section)
router.get('/archived', optionalAuth, (req, res) => {
  try {
    const now = new Date().toISOString();
    const currentUserId = req.user ? req.user.id : null;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, title, description, problem, category, difficulty, market, votes, userId, visibility, expiryDate, viewCount, createdAt, updatedAt
      FROM ideas
      WHERE expiryDate IS NOT NULL AND expiryDate <= ?
    `;
    let params = [now];

    // Non-owners can only see archived ideas that were 'active'
    if (currentUserId) {
      query += ` AND (visibility = 'active' OR userId = ?)`;
      params.push(currentUserId);
    } else {
      query += ` AND visibility = 'active'`;
    }

    query += ` ORDER BY expiryDate DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ideas/:id - Get idea details and increment view count
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM ideas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Idea not found' });

    // Increment viewCount asynchronously
    db.run('UPDATE ideas SET viewCount = viewCount + 1 WHERE id = ?', [id]);

    // Return the idea with incremented viewCount
    row.viewCount += 1;
    res.json(row);
  });
});

// POST /api/ideas - Create idea (Protected)
router.post('/', protect, (req, res) => {
  try {
    const { title, description, problem, category, difficulty, market, visibility = 'active', expiryDays } = req.body;
    if (!title || !description || !problem || !category || !difficulty || !market) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate visibility
    if (!['active', 'hidden'].includes(visibility)) {
      return res.status(400).json({ error: 'Visibility must be "active" or "hidden"' });
    }

    // Validate difficulty
    const diff = parseInt(difficulty);
    if (isNaN(diff) || diff < 1 || diff > 5) {
      return res.status(400).json({ error: 'Difficulty must be between 1 and 5' });
    }

    // Validate market
    const validMarkets = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    if (!validMarkets.includes(market)) {
      return res.status(400).json({ error: `Market must be one of: ${validMarkets.join(', ')}` });
    }

    let expiryDate = null;
    if (expiryDays) {
      const days = parseInt(expiryDays);
      if (isNaN(days) || days < 1) {
        return res.status(400).json({ error: 'expiryDays must be a positive integer' });
      }
      expiryDate = new Date(Date.now() + days * 86400000).toISOString();
    }

    const idea = {
      id: uuidv4(),
      title,
      description,
      problem,
      category,
      difficulty: diff,
      market,
      votes: 0,
      userId: req.user.id,
      visibility,
      expiryDate,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.run(
      `INSERT INTO ideas (id, title, description, problem, category, difficulty, market, votes, userId, visibility, expiryDate, viewCount, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idea.id, idea.title, idea.description, idea.problem, idea.category, idea.difficulty, idea.market, idea.votes, idea.userId, idea.visibility, idea.expiryDate, idea.viewCount, idea.createdAt, idea.updatedAt],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(idea);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/ideas/:id/vote - Upvote
router.patch('/:id/vote', (req, res) => {
  const { id } = req.params;
  db.run(
    'UPDATE ideas SET votes = votes + 1, updatedAt = ? WHERE id = ?',
    [new Date().toISOString(), id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Idea not found' });
      // Return the updated idea
      db.get('SELECT * FROM ideas WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

// PUT /api/ideas/:id - Update idea (Protected, checking ownership)
router.put('/:id', protect, (req, res) => {
  const { id } = req.params;
  const { title, description, problem, category, difficulty, market, visibility } = req.body;

  // First verify ownership
  db.get('SELECT userId FROM ideas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Idea not found' });

    if (row.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to edit this idea' });
    }

    // Build dynamic update query
    let query = `UPDATE ideas SET updatedAt = ?`;
    let params = [new Date().toISOString()];

    if (title) { query += ', title = ?'; params.push(title); }
    if (description) { query += ', description = ?'; params.push(description); }
    if (problem) { query += ', problem = ?'; params.push(problem); }
    if (category) { query += ', category = ?'; params.push(category); }
    if (difficulty) { query += ', difficulty = ?'; params.push(parseInt(difficulty)); }
    if (market) { query += ', market = ?'; params.push(market); }
    if (visibility) {
      if (!['active', 'hidden'].includes(visibility)) {
        return res.status(400).json({ error: 'Visibility must be "active" or "hidden"' });
      }
      query += ', visibility = ?'; params.push(visibility);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    db.run(query, params, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      // Return the updated idea
      db.get('SELECT * FROM ideas WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    });
  });
});

// DELETE /api/ideas/:id - Delete (Protected, checking ownership)
router.delete('/:id', protect, (req, res) => {
  const { id } = req.params;

  // First verify ownership
  db.get('SELECT userId FROM ideas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Idea not found' });

    if (row.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to delete this idea' });
    }

    db.run('DELETE FROM ideas WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

export default router;
