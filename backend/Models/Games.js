const pool = require('./db');

const initializeGamesTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS games (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          genre VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Games table initialized");
    } catch (error) {
      console.error("Error initializing games table:", error);
    }
  };
  initializeGamesTable();
  
  const gameModel = {
    create: async (name, genre) => {
      try {
        const result = await pool.query(
          'INSERT INTO games (name, genre) VALUES ($1, $2) RETURNING *',
          [name, genre]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Error creating game:", error);
        throw error;
      }
    },
    findAll: async () => {
      try {
        const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC');
        return result.rows;
      } catch (error) {
        console.error("Error fetching games:", error);
        throw error;
      }
    },

    findById: async (id) => {
      try {
        const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
        return result.rows[0];
      } catch (error) {
        console.error("Error finding game by ID:", error);
        throw error;
      }
    },
  
    update: async (id, { name, genre }) => {
      try {
        const fields = [];
        const values = [];
        let idx = 1;
  
        if (name) {
          fields.push(`name = $${idx++}`);
          values.push(name);
        }
  
        if (genre) {
          fields.push(`genre = $${idx++}`);
          values.push(genre);
        }
  
        values.push(id); // Final value for the WHERE clause
  
        const query = `
          UPDATE games
          SET ${fields.join(', ')}
          WHERE id = $${idx}
          RETURNING *
        `;
  
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error("Error updating game:", error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const result = await pool.query(
          'DELETE FROM games WHERE id = $1',
          [id]
        );
        return result;
      } catch (error) {
        console.error("Error deleting game:", error);
        throw error;
      }
    },

  };
  
  module.exports = gameModel;