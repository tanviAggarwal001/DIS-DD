const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    require: true,
    rejectUnauthorized: false
  },
  // connectionTimeoutMillis: 50000, // Increase timeout to 5 seconds
  // idleTimeoutMillis: 30000,      // Close idle connections after 30 seconds
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("PostgreSQL connection error:", err);
  } else {
    console.log("✅ PostgreSQL connected successfully at:", res.rows[0].now);
  }
});

module.exports = pool;