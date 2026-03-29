const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// SIGN UP
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  const hash = bcrypt.hashSync(password, 10);
  try {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    );
    const result = stmt.run(name, email, hash);
    res.json({ success: true, userId: result.lastInsertRowid, name, email });
  } catch (err) {
    res.status(409).json({ error: 'Email already registered' });
  }
});

// SIGN IN
router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });

  // Return user data (in production, use JWT tokens here)
  res.json({ success: true, userId: user.id, name: user.name, email: user.email });
});

module.exports = router;