const pool = require('./db');

// Initialize scores table
const initializeScoresTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        match_id INT REFERENCES matches(id) ON DELETE CASCADE,
        player_id INT REFERENCES users(id) ON DELETE CASCADE,
        score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (match_id, player_id)
      );
    `);
    console.log("Scores table initialized");
  } catch (error) {
    console.error("Error initializing scores table:", error);
  }
};

initializeScoresTable();



module.exports = {
  // Placeholder for future score-related functions
};
