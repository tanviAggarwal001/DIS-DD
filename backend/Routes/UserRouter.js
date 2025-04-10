// routes/UserRouter.js
const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const pool = require('../Models/db');

// Get user profile
router.get('/:id', UserController.getUserProfile);

// Update user profile
router.put('/:id', UserController.updateUserProfile);





// Get personal stats for a user
router.get('/:id/stats', async (req, res) => {
    const userId = parseInt(req.params.id);
    
    try {
        const [matchesPlayed, matchesWon, tournamentsParticipated, averageScoreResult] = await Promise.all([
            pool.query(`SELECT COUNT(*) FROM matches WHERE player1_id = $1 OR player2_id = $1`, [userId]),
            pool.query(`SELECT COUNT(*) FROM matches WHERE winner_id = $1`, [userId]),
            pool.query(`SELECT COUNT(DISTINCT tournament_id) FROM tournament_participants WHERE user_id = $1`, [userId]),
            pool.query(`SELECT AVG(score) FROM scores WHERE player_id = $1`, [userId])
        ]);
        
        const winRate = matchesPlayed.rows[0].count > 0
        ? Math.round((matchesWon.rows[0].count / matchesPlayed.rows[0].count) * 100)
        : 0;
        
        res.json({
            matchesPlayed: parseInt(matchesPlayed.rows[0].count),
            matchesWon: parseInt(matchesWon.rows[0].count),
            tournamentsParticipated: parseInt(tournamentsParticipated.rows[0].count),
            averageScore: parseFloat(averageScoreResult.rows[0].avg) || 0,
            winRate
    });
} catch (err) {
    console.error("Error fetching player stats:", err);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
});


const rankOrder = ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

router.get('/leaderboard', async (req, res) => {
  try {
    console.log("came ot users routes");
    const result = await pool.query(
      `SELECT id, name, email, rank FROM users`
    );

    const rankedUsers = result.rows.map(user => ({
      ...user,
      rankIndex: rankOrder.indexOf(user.rank || 'Unranked')
    }));

    rankedUsers.sort((a, b) => b.rankIndex - a.rankIndex);
    console.log(rank)
    res.json(rankedUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});



module.exports = router;
