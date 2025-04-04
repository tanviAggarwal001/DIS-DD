const pool = require('./db');

const initializeTeamsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Teams table initialized");
  } catch (error) {
    console.error("Error initializing teams table:", error);
  }
};
initializeTeamsTable();

const teamModel = {
  create: async (name) => {
    try {
      const result = await pool.query(
        'INSERT INTO teams (name) VALUES ($1) RETURNING *',
        [name]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  },
  findAll: async () => {
    try {
      const result = await pool.query('SELECT * FROM teams ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  },
};

module.exports = teamModel;