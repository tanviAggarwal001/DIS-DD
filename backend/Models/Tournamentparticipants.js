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
    register: async (tournament_id, user_id) => {
      try {
        const { userId } = req.params;
    
        const result = await pool.query(`
          SELECT t.*
          FROM tournaments t
          INNER JOIN tournament_participants tp
          ON t.id = tp.tournament_id
          WHERE tp.user_id = $1
        `, [userId]);
    
        res.status(200).json(result.rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  
    
    },

    
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
  
  
  // module.exports = {};
  