const express = require('express');
const db = require('../db');
const router = express.Router();

// GET profile
router.get('/:userId', (req, res) => {
  const user = db.prepare(
    'SELECT id, name, email, age, gender, height, weight, activity_level, goal FROM users WHERE id = ?'
  ).get(req.params.userId);
  res.json(user || {});
});

// UPDATE profile
router.put('/:userId', (req, res) => {
  const { name, age, gender, height, weight, activityLevel, goal } = req.body;
  db.prepare(`
    UPDATE users SET name=?, age=?, gender=?, height=?, weight=?, activity_level=?, goal=?
    WHERE id=?
  `).run(name, age, gender, height, weight, activityLevel, goal, req.params.userId);
  res.json({ success: true });
});

// Water & Steps (upsert)
router.post('/:userId/stats', (req, res) => {
  const { water, steps } = req.body;
  db.prepare(`
    INSERT INTO daily_stats (user_id, water_glasses, steps)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, stat_date) DO UPDATE SET
      water_glasses = excluded.water_glasses,
      steps = excluded.steps
  `).run(req.params.userId, water, steps);
  res.json({ success: true });
});

module.exports = router;