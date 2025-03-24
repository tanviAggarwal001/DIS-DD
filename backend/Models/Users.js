const pool = require('./db');

// Create users table if not exists
const initializeUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table initialized");
    
    // Check if admin exists, if not create a default admin
    const adminCheck = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const adminPassword = await bcrypt.hash('admin123', 10); // Default admin password - change in production
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin', 'admin@example.com', adminPassword, 'admin']
      );
      console.log("Default admin user created");
    }
  } catch (error) {
    console.error("Error initializing users table:", error);
  }
};

// Initialize the table when this module is imported
initializeUsersTable();

const userModel = {
  // Find a user by email
  findOne: async (filter) => {
    try {
      const { email } = filter;
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  },
  
  // Find a user by ID
  findById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  },
  
  // Create a new user
  create: async (userData) => {
    try {
      const { name, email, password, role = 'user' } = userData;
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  
  // Get all users
  findAll: async () => {
    try {
      const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },
  
  // Delete a user
  deleteUser: async (id) => {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  
  // Update a user
  updateUser: async (id, userData) => {
    try {
      const { name, email, role } = userData;
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
        [name, email, role, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
};

module.exports = userModel;