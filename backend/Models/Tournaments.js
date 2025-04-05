const pool = require('./db');

// Initialize tournaments table
const initializeTournamentsTable = async () => {
  try {
    await pool.query(`
       CREATE TABLE IF NOT EXISTS tournaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        game_id INT REFERENCES games(id),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_by INT NOT NULL,
        members_per_match INT NOT NULL,
        status VARCHAR(20) DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tournaments table initialized");
  } catch (error) {
    console.error("Error initializing tournaments table:", error);
  }
};

initializeTournamentsTable();

//  Tournament Model
const tournamentModel = {
  create: async (name, game_id, start_date, end_date, created_by, members_per_match) => {
    try {
      console.log("came to models");
  
      const currentDate = new Date();
      const sDate = new Date(start_date);
      const eDate = new Date(end_date);
  
      let status = 'upcoming';
      if (currentDate >= sDate && currentDate <= eDate) {
        status = 'ongoing';
      } else if (currentDate > eDate) {
        status = 'completed';
      }
  
      const result = await pool.query(
        `INSERT INTO tournaments (name, game_id, start_date, end_date, created_by, members_per_match, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, game_id, start_date, end_date, created_by, members_per_match, status]
      );
  
      return result.rows[0];
    } catch (error) {
      console.error("Error creating tournament:", error);
      throw error;
    }
  },

  update: async (id, name, game_id, start_date, end_date, members_per_match) => {
    try {
      const currentDate = new Date();
      const sDate = new Date(start_date);
      const eDate = new Date(end_date);

      let status = 'upcoming';
      if (currentDate >= sDate && currentDate <= eDate) {
        status = 'ongoing';
      } else if (currentDate > eDate) {
        status = 'completed';
      }

      const result = await pool.query(
        `UPDATE tournaments SET name = $1, game_id = $2, start_date = $3, end_date = $4, members_per_match = $5, status = $6 WHERE id = $7 RETURNING *`,
        [name, game_id, start_date, end_date, members_per_match, status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating tournament:", error);
      throw error;
    }
  },

  findAll: async () => {
    try {
      const result = await pool.query(`SELECT * FROM tournaments ORDER BY start_date ASC`);
      return result.rows;
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM tournaments WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding tournament:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await pool.query(`DELETE FROM tournaments WHERE id = $1`, [id]);
      return { message: 'Tournament deleted successfully' };
    } catch (error) {
      console.error("Error deleting tournament:", error);
      throw error;
    }
  }
};

module.exports = tournamentModel;
