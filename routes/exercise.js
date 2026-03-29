const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/:userId', (req, res) => {
  const logs = db.prepare(`
    SELECT * FROM exercise_logs 
    WHERE user_id = ? AND logged_date = date('now')
  `).all(req.params.userId);
  res.json(logs);
});

router.post('/', (req, res) => {
  const { userId, name, type, duration, calories, intensity } = req.body;
  const result = db.prepare(`
    INSERT INTO exercise_logs (user_id, exercise_name, exercise_type, duration, calories_burned, intensity)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, name, type, duration, calories, intensity);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM exercise_logs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;