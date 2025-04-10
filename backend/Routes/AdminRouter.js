const express = require("express");
const { adminLoginValidation, adminRegisterValidation } = require("../Middlewares/AdminMiddleware");
const { adminLogin, registerAdmin, getAllAdmins } = require("../Controllers/AdminController");
const { verifyAdminToken, verifySuperAdmin } = require("../Middlewares/AuthMiddleware");
const pool = require('../Models/db');

const router = express.Router();


router.get('/stats', async (req, res) => {
    const adminId = 2;
    // console.log("admins")
    try {
        const [t1, t2, t3, t4] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM tournaments WHERE created_by = $1', [adminId]),
            pool.query(`SELECT COUNT(*) FROM tournaments WHERE status = 'ongoing'`),
            pool.query(`SELECT COUNT(*) FROM matches`),
            pool.query(`SELECT COUNT(DISTINCT user_id) FROM tournament_participants`)
          ]);
          
          res.json({
            totalTournaments: parseInt(t1.rows[0].count),
            ongoingTournaments: parseInt(t2.rows[0].count),
            totalMatches: parseInt(t3.rows[0].count),
            totalPlayers: parseInt(t4.rows[0].count)
          });
          
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });
  
  // Get all users
  router.get('/users', async (req, res) => {
    try {
      const result = await pool.query(`SELECT id, name, email, rank FROM users ORDER BY id`);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  // Admin authentication routes
router.post("/login", adminLoginValidation, adminLogin);
router.post("/register", adminRegisterValidation, registerAdmin);

// Protected admin routes
router.get("/all", verifyAdminToken, verifySuperAdmin, getAllAdmins);

module.exports = router;