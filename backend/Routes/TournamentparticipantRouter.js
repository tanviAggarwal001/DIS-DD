const express = require('express');
const router = express.Router();
const controller = require('../Controllers/TournamentParticipantController');
const pool = require('../Models/db');


router.post('/register', controller.register);
router.get('/:userId', controller.getUserRegistrations);
// routes/participants.js or wherever appropriate
router.get('/registered/:tournamentId', async (req, res) => {
    const { tournamentId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT u.name, u.rank , u.id
         FROM users u 
         JOIN "tournament_participants" tp ON u.id = tp.user_id 
         WHERE tp.tournament_id = $1`,
        [tournamentId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching registered players:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;
