const express = require('express');
const router = express.Router();
const controller = require('../Controllers/TournamentParticipantController');

router.post('/register', controller.register);
router.get('/:userId', controller.getUserRegistrations);

module.exports = router;
