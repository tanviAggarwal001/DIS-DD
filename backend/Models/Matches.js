const pool = require('./db');

// Initialize matches table
const initializeMatchesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
        player1_id INT REFERENCES users(id) ON DELETE CASCADE,
        player2_id INT REFERENCES users(id) ON DELETE CASCADE,
        scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        winner_id INT REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'scheduled'
      )
    `);
    console.log("Matches table initialized");
  } catch (error) {
    console.error("Error initializing matches table:", error);
  }
};

initializeMatchesTable();

// 🏆 Match Model
const matchModel = {
  create: async (tournament_id, player1_id, player2_id, scheduled_at = null) => {
    try {
      const result = await pool.query(
        `INSERT INTO matches (tournament_id, player1_id, player2_id, scheduled_at)
         VALUES ($1, $2, $3, COALESCE($4, CURRENT_TIMESTAMP))
         RETURNING *`,
        [tournament_id, player1_id, player2_id, scheduled_at]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating match:", error);
      throw error;
    }
  },

  findAll: async () => {
    try {
      const result = await pool.query(`SELECT * FROM matches ORDER BY scheduled_at ASC`);
      return result.rows;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error;
    }
  },

  findByUser: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT * FROM matches 
         WHERE player1_id = $1 OR player2_id = $1 
         ORDER BY scheduled_at ASC`,
        [user_id]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching matches for user:", error);
      throw error;
    }
  },

  findByTournament: async (tournament_id) => {
    try {
      const result = await pool.query(
        `SELECT * FROM matches WHERE tournament_id = $1 ORDER BY scheduled_at ASC`,
        [tournament_id]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching matches for tournament:", error);
      throw error;
    }
  },

  updateWinner: async (match_id, winner_id) => {
    try {
      const result = await pool.query(
        `UPDATE matches SET winner_id = $1, status = 'completed' WHERE id = $2 RETURNING *`,
        [winner_id, match_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating match winner:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await pool.query(`DELETE FROM matches WHERE id = $1`, [id]);
      return { message: 'Match deleted successfully' };
    } catch (error) {
      console.error("Error deleting match:", error);
      throw error;
    }
  }
};

module.exports = matchModel;
