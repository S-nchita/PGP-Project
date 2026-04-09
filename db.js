const Database = require('better-sqlite3');
const db = new Database('fittrack.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    height REAL,
    weight REAL,
    activity_level TEXT DEFAULT 'Moderately Active',
    goal TEXT DEFAULT 'Lose Weight',
    coins INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Handle existing users who might not have the 'coins' column
  -- SQLite does not support IF NOT EXISTS for ADD COLUMN directly in standard SQL for all versions, 
  -- but better-sqlite3 should handle these scripts.
  -- Alternatively, we can use a try-catch in the JS side or just execute it.
  -- Here, I'll use a different strategy: adding it via PRAGMA or just another exec.

  CREATE TABLE IF NOT EXISTS food_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    meal_type TEXT NOT NULL,       -- 'breakfast','lunch','dinner','snacks'
    food_name TEXT NOT NULL,
    calories INTEGER,
    protein REAL,
    carbs REAL,
    fats REAL,
    portion TEXT DEFAULT 'medium', -- 'small','medium','large'
    logged_date DATE DEFAULT (date('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS exercise_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    exercise_type TEXT,
    duration INTEGER,              -- minutes
    calories_burned INTEGER,
    intensity TEXT DEFAULT 'medium',
    logged_date DATE DEFAULT (date('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS daily_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    stat_date DATE DEFAULT (date('now')),
    water_glasses INTEGER DEFAULT 0,
    steps INTEGER DEFAULT 0,
    UNIQUE(user_id, stat_date),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS daily_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    goal_type TEXT NOT NULL, -- e.g. 'steps', 'water', 'calories', 'exercise'
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    goal_date DATE DEFAULT (date('now')),
    reward_coins INTEGER DEFAULT 10,
    completed BOOLEAN DEFAULT 0,
    UNIQUE(user_id, goal_type, goal_date),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    icon TEXT,
    type TEXT DEFAULT 'badge' -- 'badge', 'unlockable', etc.
  );

  CREATE TABLE IF NOT EXISTS user_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reward_id INTEGER NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
  );
`);

// Add 'coins' column if it doesn't already exist in users table
try {
  db.exec("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 0;");
} catch (e) {
  // Column likely already exists
}

// Seed rewards if the table is empty
const rewardsCount = db.prepare("SELECT count(*) as count FROM rewards").get().count;
if (rewardsCount === 0) {
  const insertReward = db.prepare("INSERT INTO rewards (name, description, cost, icon, type) VALUES (?, ?, ?, ?, ?)");
  insertReward.run("Golden Badge", "Awarded for consistent 7-day streak", 100, "🏆", "badge");
  insertReward.run("Health Guru", "Unlock exclusive diet plans", 500, "🥗", "unlockable");
  insertReward.run("Marathoner", "Recognition for 50,000 total steps", 300, "🏃", "badge");
  insertReward.run("Hydration Pro", "Drink 8 glasses of water for 5 days", 200, "💧", "badge");
  insertReward.run("FitTrack Master", "Complete all weekly goals", 1000, "👑", "badge");
}

module.exports = db;