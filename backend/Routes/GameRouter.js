const express = require('express');
const gameController = require('../Controllers/GameController');
const router = express.Router();

// Fetch all games
router.get('/', gameController.getAllGames);

// Add a new game (Admin only)
router.post('/', gameController.addGame);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);
module.exports = router;
