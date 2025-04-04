const express = require('express');
const router = express.Router();
const controller = require('../Controllers/TournamentController');

// Middlewares for auth should attach req.user = { id, isAdmin }
router.post('/create', controller.createTournament);
router.delete('/:id', controller.deleteTournament);
router.get('/', controller.getAllTournaments);

module.exports = router;