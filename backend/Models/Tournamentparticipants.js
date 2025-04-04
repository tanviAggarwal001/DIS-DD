const pool = require('./db');

const initializeTournamentParticipantsTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tournament_participants (
          id SERIAL PRIMARY KEY,
          tournament_id INT REFERENCES tournaments(id),
          team_id INT REFERENCES teams(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Tournament Participants table initialized");
    } catch (error) {
      console.error("Error initializing tournament participants table:", error);
    }
  };
  initializeTournamentParticipantsTable();
  
  module.exports = {};
  