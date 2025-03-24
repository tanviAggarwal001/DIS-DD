const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log("PostgreSQL connection error:", err);
  } else {
    console.log("PostgreSQL connected successfully at:", res.rows[0].now);
  }
});

module.exports = pool;