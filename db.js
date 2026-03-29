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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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
`);

module.exports = db;