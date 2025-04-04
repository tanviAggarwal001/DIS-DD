
const pool = require('./db');

const initializeTournamentsTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tournaments (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          game_id INT REFERENCES games(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Tournaments table initialized");
    } catch (error) {
      console.error("Error initializing tournaments table:", error);
    }
  };
  initializeTournamentsTable();
  
  const tournamentModel = {
    create: async (name, game_id) => {
      try {
        const result = await pool.query(
          'INSERT INTO tournaments (name, game_id) VALUES ($1, $2) RETURNING *',
          [name, game_id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Error creating tournament:", error);
        throw error;
      }
    },
    findAll: async () => {
      try {
        const result = await pool.query('SELECT * FROM tournaments ORDER BY created_at DESC');
        return result.rows;
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        throw error;
      }
    },
  };
  
  module.exports = tournamentModel;