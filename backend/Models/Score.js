const pool = require('./db');


const initializeScoresTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS scores (
          id SERIAL PRIMARY KEY,
          tournament_id INT REFERENCES tournaments(id),
          team_id INT REFERENCES teams(id),
          score INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Scores table initialized");
    } catch (error) {
      console.error("Error initializing scores table:", error);
    }
  };
  initializeScoresTable();
  
  module.exports = {};