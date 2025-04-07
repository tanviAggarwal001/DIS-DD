const matchModel = require('../Models/Matches');

// 1. Create a new match
exports.create = async (req, res) => {
  const { tournament_id, player1_id, player2_id} = req.body;

  try {
    const newMatch = await matchModel.create(tournament_id, player1_id, player2_id);
    res.status(201).json(newMatch);
  } catch (err) {
    console.error("Error creating match:", err);
    res.status(500).json({ error: 'Failed to create match' });
  }
};

// 2. Get all matches in a tournament
exports.getByTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const matches = await matchModel.findByTournamentWithUsernames(tournamentId);
    res.json(matches);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// 3. Get all matches of a specific user
exports.getByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const matches = await matchModel.findByUserWithDetails(userId);
    res.json(matches);
  } catch (error) {
    console.error('Error in getByUser:', error);
    res.status(500).json({ error: 'Failed to fetch user matches with details' });
  }
};


// 4. Set match winner
exports.setWinner = async (req, res) => {
  const { matchId } = req.params;
  const { winner_id } = req.body;

  try {
    const updatedMatch = await matchModel.updateWinner(matchId, winner_id);
    res.json(updatedMatch);
  } catch (err) {
    console.error("Error setting winner:", err);
    res.status(500).json({ error: 'Failed to update winner' });
  }
};

// 5. Delete match
exports.delete = async (req, res) => {
  const { matchId } = req.params;

  try {
    const result = await matchModel.delete(matchId);
    res.json(result);
  } catch (err) {
    console.error("Error deleting match:", err);
    res.status(500).json({ error: 'Failed to delete match' });
  }
};