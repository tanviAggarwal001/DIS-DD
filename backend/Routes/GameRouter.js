const express = require('express');
const gameController = require('../Controllers/GameController');
const router = express.Router();
const pool = require("../Models/db")

// Fetch all games
router.get('/', gameController.getAllGames);

// Add a new game (Admin only)
router.post('/', gameController.addGame);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);


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
    // console.log(rank)
    res.json(rankedUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});


module.exports = router;
