const express = require('express');
const router = express.Router();
const controller = require('../Controllers/TournamentController');

// Middlewares for auth should attach req.user = { id, isAdmin }
router.post('/create', controller.createTournament);
router.get('/', controller.getAllTournaments);
router.delete('/:id', controller.deleteTournament);
router.put('/:id', controller.editTournament);

module.exports = router;
