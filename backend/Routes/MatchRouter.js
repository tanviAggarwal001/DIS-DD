const express = require('express');
const router = express.Router();
const matchController = require('../Controllers/MatchController');
router.get('/user/:userId', matchController.getByUser);
router.post('/', matchController.create);
router.get('/tournament/:tournamentId', matchController.getByTournament);
router.get('/user/:userId', matchController.getByUser);
router.put('/winner/:matchId', matchController.setWinner);
router.delete('/:matchId', matchController.delete);

module.exports = router;
