const express = require('express');
const db = require('../db');
const router = express.Router();

// GET today's food logs for a user
router.get('/:userId', (req, res) => {
  const logs = db.prepare(`
    SELECT * FROM food_logs 
    WHERE user_id = ? AND logged_date = date('now')
    ORDER BY meal_type
  `).all(req.params.userId);
  res.json(logs);
});

// ADD food item
router.post('/', (req, res) => {
  const { userId, mealType, foodName, calories, protein, carbs, fats, portion } = req.body;
  const stmt = db.prepare(`
    INSERT INTO food_logs (user_id, meal_type, food_name, calories, protein, carbs, fats, portion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(userId, mealType, foodName, calories, protein, carbs, fats, portion);
  res.json({ success: true, id: result.lastInsertRowid });
});

// DELETE food item
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM food_logs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;