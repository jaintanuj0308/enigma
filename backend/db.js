import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const DB_PATH = './ideas.db';

// Singleton: one shared DB instance for the entire app
let dbInstance = null;
let initPromise = null;

const initDB = () => {
  // Return the existing promise if already initializing or done
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);

      // Enable WAL mode for better concurrent access
      db.run('PRAGMA journal_mode=WAL', () => {
        // Create users table
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt TEXT NOT NULL
          )
        `, (err) => {
          if (err) return reject(err);

          // Create ideas table
          db.run(`
            CREATE TABLE IF NOT EXISTS ideas (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              description TEXT NOT NULL,
              problem TEXT NOT NULL,
              category TEXT NOT NULL,
              difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
              market TEXT NOT NULL,
              votes INTEGER DEFAULT 0,
              userId TEXT NOT NULL,
              visibility TEXT DEFAULT 'active',
              expiryDate TEXT,
              viewCount INTEGER DEFAULT 0,
              createdAt TEXT NOT NULL,
              updatedAt TEXT NOT NULL,
              FOREIGN KEY (userId) REFERENCES users(id)
            )
          `, (err) => {
            if (err) return reject(err);

            dbInstance = db;
            seedDefaultData(db, resolve, reject);
          });
        });
      });
    });
  });

  return initPromise;
};

const seedDefaultData = async (db, resolve, reject) => {
  db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
    if (err) return reject(err);

    if (row.count === 0) {
      // Create default admin user
      const defaultUserId = uuidv4();
      const hash = await bcrypt.hash('password123', 10);

      db.run(
        'INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)',
        [defaultUserId, 'admin', hash, new Date().toISOString()],
        (err) => {
          if (err) return reject(err);
          seedIdeas(db, defaultUserId, resolve, reject);
        }
      );
    } else {
      // Users exist, check if ideas need seeding
      db.get('SELECT id FROM users LIMIT 1', (err, user) => {
        if (err) return reject(err);
        seedIdeas(db, user ? user.id : null, resolve, reject);
      });
    }
  });
};

const seedIdeas = (db, userId, resolve, reject) => {
  if (!userId) return resolve(db);

  db.get('SELECT COUNT(*) as count FROM ideas', (err, row) => {
    if (err) return reject(err);
    if (row.count > 0) return resolve(db);

    const ideas = [
      {
        id: uuidv4(),
        title: 'AI Code Reviewer',
        description: 'An AI assistant that automatically reviews pull requests, explains complex diffs, and suggests performance improvements based on team style guides.',
        problem: 'Code reviews are time-consuming and often miss subtle bugs.',
        category: 'AI/ML',
        difficulty: 4,
        market: 'High',
        votes: 142,
        userId,
        visibility: 'active',
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        viewCount: 235,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Niche Habit Tracker',
        description: 'A gamified habit tracker focused exclusively on micro-habits for neurodivergent individuals, focusing on low-friction engagement.',
        problem: 'Traditional habit trackers are too punishing when streaks are broken.',
        category: 'Healthtech',
        difficulty: 2,
        market: 'Medium',
        votes: 89,
        userId,
        visibility: 'active',
        expiryDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        viewCount: 124,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Hyperlocal Marketplace',
        description: 'A platform to buy, sell, and rent specialized tools and equipment (drills, ladders, projectors) within a 5-block radius.',
        problem: 'Buying tools for a one-time use is expensive and wasteful.',
        category: 'E-commerce',
        difficulty: 3,
        market: 'Very High',
        votes: 256,
        userId,
        visibility: 'active',
        expiryDate: null,
        viewCount: 410,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'No-Code Web3 Onboarding',
        description: 'A SaaS platform that allows traditional web2 companies to offer crypto payments and NFT memberships without writing any blockchain code.',
        problem: 'Web3 tech is too complex for standard businesses to integrate.',
        category: 'Fintech',
        difficulty: 5,
        market: 'Very High',
        votes: 310,
        userId,
        visibility: 'active',
        expiryDate: null,
        viewCount: 520,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Micro-SaaS Analytics UI',
        description: 'A drop-in React component library that instantly gives your SaaS app a beautiful, fully functional user analytics dashboard.',
        problem: 'Building internal dashboards takes time away from core features.',
        category: 'SaaS',
        difficulty: 3,
        market: 'High',
        votes: 198,
        userId,
        visibility: 'active',
        expiryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        viewCount: 305,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ];

    const stmt = db.prepare(
      `INSERT INTO ideas (id, title, description, problem, category, difficulty, market, votes, userId, visibility, expiryDate, viewCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    let pending = ideas.length;
    let failed = false;

    for (const idea of ideas) {
      stmt.run(
        [idea.id, idea.title, idea.description, idea.problem, idea.category, idea.difficulty, idea.market, idea.votes, idea.userId, idea.visibility, idea.expiryDate, idea.viewCount, idea.createdAt, idea.updatedAt],
        (err) => {
          if (failed) return;
          if (err) { failed = true; return reject(err); }
          pending--;
          if (pending === 0) {
            stmt.finalize();
            resolve(db);
          }
        }
      );
    }
  });
};

export default initDB;
