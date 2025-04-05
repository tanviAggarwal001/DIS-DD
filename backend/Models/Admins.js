const pool = require('./db');

// Create admins table if not exists
const initializeAdminsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Admins table initialized");
    const adminCheck = await pool.query('SELECT * FROM admins WHERE role = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const adminPassword = await bcrypt.hash('admin123', 10); // Default admin password - change in production
      await pool.query(
        'INSERT INTO admins (username, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin', 'admin@example.com', adminPassword, 'admin']
      );
      console.log("Default admin created in admins table");
    }
  } catch (error) {
    console.error("Error initializing admins table:", error);
  }
};

// Initialize the table when this module is imported
initializeAdminsTable();

const adminModel = {
  // Find an admin by email
  findOne: async (filter) => {
    try {
      const { email } = filter;
      const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding admin:", error);
      throw error;
    }
  },
  
  // Create a new admin
  create: async (adminData) => {
    try {
      const { username, email, password, role = 'admin' } = adminData;
      const result = await pool.query(
        'INSERT INTO admins (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, password, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  },

  getUserIdByUsername : async (req, res) => {
    const { username } = req.params;
    try {
      console.log("came here");
      const result = await pool.query("SELECT id FROM admins WHERE name = $1", [username]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Admin not found" });
      res.json({ id: result.rows[0].id });
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  // Get all admins
  findAll: async () => {
    try {
      const result = await pool.query('SELECT id, username, email, role, created_at FROM admins');
      return result.rows;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  }
};

module.exports = adminModel;