const pool = require('./db');

const initializeLeadershipTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS leadership (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id),
          team_id INT REFERENCES teams(id),
          role VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Leadership table initialized");
    } catch (error) {
      console.error("Error initializing leadership table:", error);
    }
  };
  initializeLeadershipTable();
  
  module.exports = {};