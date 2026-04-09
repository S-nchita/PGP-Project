const express = require('express');
const router = express.Router();
const db = require('../db');
const { callGemini } = require('../utils/ai');

// Get user coins and daily goals
router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split('T')[0];

  try {
    const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure daily goals exist for today
    const existingGoals = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND goal_date = ?').all(userId, today);
    
    if (existingGoals.length === 0) {
      // PROMPT FOR AI GOALS
      const prompt = `Generate 4 personalized daily fitness goals for a user.
      Goal types available: water (intake in glasses), steps (count), calories_burned (kcal), meals_logged (count).
      Return ONLY valid JSON array like: 
      [{"type": "water", "target": 8, "reward": 10}, {"type": "steps", "target": 10000, "reward": 20}, ...]`;

      let dailyGoals;
      try {
        dailyGoals = await callGemini(prompt);
        if (!Array.isArray(dailyGoals)) throw new Error("Invalid AI format");
      } catch (error) {
        console.warn("AI Goal Generation failed, using defaults");
        dailyGoals = [
          { type: 'water', target: 8, reward: 10 },
          { type: 'steps', target: 10000, reward: 20 },
          { type: 'calories_burned', target: 500, reward: 30 },
          { type: 'meals_logged', target: 3, reward: 15 }
        ];
      }

      const insertGoal = db.prepare('INSERT INTO daily_goals (user_id, goal_type, target_value, goal_date, reward_coins) VALUES (?, ?, ?, ?, ?)');
      dailyGoals.forEach(g => {
        insertGoal.run(userId, g.type, g.target, today, g.reward);
      });
    }

    const goals = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND goal_date = ?').all(userId, today);
    res.json({ coins: user.coins, goals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update goal progress
router.post('/update-goal', (req, res) => {
  const { userId, goalType, incrementValue } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const goal = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND goal_type = ? AND goal_date = ?').get(userId, goalType, today);
    
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    if (goal.completed) return res.json({ message: 'Goal already completed', goal });

    const newValue = goal.current_value + incrementValue;
    let completed = newValue >= goal.target_value ? 1 : 0;
    
    db.prepare('UPDATE daily_goals SET current_value = ?, completed = ? WHERE id = ?')
      .run(newValue, completed, goal.id);

    if (completed && !goal.completed) {
      db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(goal.reward_coins, userId);
    }

    const updatedGoal = db.prepare('SELECT * FROM daily_goals WHERE id = ?').get(goal.id);
    const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(userId);
    
    res.json({ goal: updatedGoal, coins: user.coins, justCompleted: completed && !goal.completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available rewards
router.get('/rewards', (req, res) => {
  try {
    const rewards = db.prepare('SELECT * FROM rewards').all();
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Claim a reward
router.post('/claim-reward', (req, res) => {
  const { userId, rewardId } = req.body;

  try {
    const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(userId);
    const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(rewardId);

    if (!user || !reward) return res.status(404).json({ error: 'User or Reward not found' });
    if (user.coins < reward.cost) return res.status(400).json({ error: 'Insufficient coins' });

    // Check if already claimed
    const alreadyClaimed = db.prepare('SELECT * FROM user_rewards WHERE user_id = ? AND reward_id = ?').get(userId, rewardId);
    if (alreadyClaimed) return res.status(400).json({ error: 'Reward already claimed' });

    db.transaction(() => {
      db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(reward.cost, userId);
      db.prepare('INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?)').run(userId, rewardId);
    })();

    const updatedUser = db.prepare('SELECT coins FROM users WHERE id = ?').get(userId);
    res.json({ message: 'Reward claimed successfully', coins: updatedUser.coins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's claimed rewards
router.get('/user-rewards/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const rewards = db.prepare(`
      SELECT r.*, ur.purchased_at 
      FROM rewards r
      JOIN user_rewards ur ON r.id = ur.reward_id
      WHERE ur.user_id = ?
    `).all(userId);
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
