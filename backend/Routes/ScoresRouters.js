const express = require('express');
const router = express.Router();
const pool = require('../Models/db');


router.get('/match/:matchId', async (req, res) => {
    const matchId = req.params.matchId;
    try {
      const scoreResult = await pool.query(
        `SELECT s.player_id, s.score, u.name 
         FROM scores s 
         JOIN users u ON s.player_id = u.id 
         WHERE s.match_id = $1`,
        [matchId]
      );
  
      if (scoreResult.rows.length < 2) {
        return res.status(404).json({ error: 'Scores not available yet' });
      }
  
      res.json(scoreResult.rows); // array of 2 players with score and name
    } catch (err) {
      console.error('Error fetching score:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;
