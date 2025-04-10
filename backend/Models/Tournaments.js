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
      game_id = parseInt(game_id);
      console.log(typeof game_id, game_id);
  
      const currentDate = new Date();
      const sDate = new Date(start_date);
      const eDate = new Date(end_date);
  
      let status = 'upcoming';
      if (currentDate >= sDate && currentDate <= eDate) {
        status = 'ongoing';
      } else if (currentDate > eDate) {
        status = 'completed';
      }
      console.log({
        name,
        game_id,
        parsedGameId: parseInt(game_id),
        start_date,
        end_date,
        created_by,
        members_per_match,
        parsedMembers: parseInt(members_per_match),
        status
      });
      const result = await pool.query(
        `INSERT INTO tournaments (name, game_id, start_date, end_date, created_by, members_per_match, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, parseInt(game_id), start_date, end_date, created_by, parseInt(members_per_match), status]
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
      const result = await pool.query(`
        SELECT 
          t.*, 
          g.name AS game_name
        FROM tournaments t
        LEFT JOIN games g ON t.game_id = g.id
        ORDER BY t.start_date ASC
      `);
      // console.log(result.rows);
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

  updateStatuses: async () => {
    try {
      // Set to 'completed'
      await pool.query(`
        UPDATE tournaments
        SET status = 'completed'
        WHERE end_date < NOW()
      `);
  
      // Set to 'ongoing'
      await pool.query(`
        UPDATE tournaments
        SET status = 'ongoing'
        WHERE start_date <= NOW() AND end_date >= NOW()
      `);
  
      // Set to 'upcoming'
      await pool.query(`
        UPDATE tournaments
        SET status = 'upcoming'
        WHERE start_date > NOW()
      `);
  
      // console.log("Tournament statuses updated based on timestamp");
    } catch (err) {
      console.error("Error updating statuses:", err);
      throw err;
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
