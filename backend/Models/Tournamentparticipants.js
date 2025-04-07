const pool = require('./db');

const initializeTournamentParticipantsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournament_participants (
        id SERIAL PRIMARY KEY,
        tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tournament_id, user_id)
      )
    `);
    console.log("Tournament Participants table initialized");
  } catch (error) {
    console.error("Error initializing tournament participants table:", error);
  }
};
initializeTournamentParticipantsTable();

const tournamentParticipants = {
  // ✅ Properly register user to tournament
  register: async (tournament_id, user_id) => {
    try {
      const result = await pool.query(
        `INSERT INTO tournament_participants (tournament_id, user_id) VALUES ($1, $2) RETURNING *`,
        [tournament_id, user_id]
      );
      return result.rows[0]; // You can return this in your controller
    } catch (error) {
      throw error;
    }
  },

  // ✅ Find tournaments a user is registered in
  findByUser: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT tournament_id FROM tournament_participants WHERE user_id = $1`,
        [user_id]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = tournamentParticipants;