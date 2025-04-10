const pool = require('./db');

// Initialize matches table without problematic constraint functions
const initializeMatchesTable = async () => {
  try {
    // First create the table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
        player1_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        player2_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  create: async (tournament_id, player1_id, player2_id) => {
    try {
      // Ensure player1_id != player2_id before trying to insert
      if (player1_id === player2_id) {
        throw new Error("Cannot create a match with the same player twice");
      }
      
      // Check if match already exists (in either order of players)
      const existingMatch = await pool.query(
        `SELECT id FROM matches 
         WHERE tournament_id = $1 
         AND ((player1_id = $2 AND player2_id = $3) OR (player1_id = $3 AND player2_id = $2))`,
        [tournament_id, player1_id, player2_id]
      );
      
      if (existingMatch.rows.length > 0) {
        throw new Error("This match already exists in the tournament");
      }
      
      const result = await pool.query(
        `INSERT INTO matches (tournament_id, player1_id, player2_id) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [tournament_id, player1_id, player2_id]
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

  
  findByUserWithDetails: async (userId) => {
    try {
      const result = await pool.query(`
        SELECT 
          M.*, 
          U1.name AS player1_name, 
          U2.name AS player2_name, 
          T.name AS tournament_name
        FROM matches M
        INNER JOIN users U1 ON M.player1_id = U1.id
        INNER JOIN users U2 ON M.player2_id = U2.id
        INNER JOIN tournaments T ON M.tournament_id = T.id
        WHERE M.player1_id = $1 OR M.player2_id = $1
        ORDER BY M.scheduled_at ASC
      `, [userId]);
  
      return result.rows;
    } catch (error) {
      console.error("Error fetching matches with user details:", error);
      throw error;
    }
  },

  findByTournamentWithUsernames: async (tournamentId) => {
    try {
      const result = await pool.query(`
        SELECT 
          M.*, 
          U1.name AS player1_name, 
          U2.name AS player2_name,
          W.name AS winner_name
        FROM matches M
        INNER JOIN users U1 ON M.player1_id = U1.id
        INNER JOIN users U2 ON M.player2_id = U2.id
        LEFT JOIN users W ON M.winner_id = W.id
        WHERE M.tournament_id = $1
        ORDER BY M.scheduled_at ASC
      `, [tournamentId]);
      
  
      return result.rows;
    } catch (error) {
      console.error("Error fetching matches with usernames by tournament:", error);
      throw error;
    }
  }
,  
  
  
  delete: async (id) => {
    try {
      `await pool.query(DELETE FROM matches WHERE id = $1, [id])`;
      return { message: 'Match deleted successfully' };
    } catch (error) {
      console.error("Error deleting match:", error);
      throw error;
    }
  }
};

module.exports = matchModel;