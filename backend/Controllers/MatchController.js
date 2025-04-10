const matchModel = require('../Models/Matches');
const scoreModel = require('../Models/Score');
const pool = require('../Models/db');
// const ranks = ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

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

exports.submitResult = async (req, res) => {
  const matchId = req.params.matchId;
  const { player1_id, player1_score, player2_id, player2_score } = req.body;

  const ranks = ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  try {
    // Insert or update player scores
    await pool.query(`
      INSERT INTO scores (match_id, player_id, score)
      VALUES 
        ($1, $2, $3),
        ($1, $4, $5)
      ON CONFLICT (match_id, player_id) DO UPDATE
      SET score = EXCLUDED.score;
    `, [matchId, player1_id, player1_score, player2_id, player2_score]);

    // Determine winner
    let winner_id = null;
    let loser_id = null;
    if (player1_score > player2_score) {
      winner_id = player1_id;
      loser_id = player2_id;
    } else if (player2_score > player1_score) {
      winner_id = player2_id;
      loser_id = player1_id;
    }

    // Update match status and winner
    await pool.query(`
      UPDATE matches
      SET winner_id = $1, status = 'completed'
      WHERE id = $2
    `, [winner_id, matchId]);

    // Fetch current ranks
    const userRanks = await pool.query(`
      SELECT id, rank FROM users WHERE id IN ($1, $2)
    `, [player1_id, player2_id]);

    const winnerRankRow = userRanks.rows.find(u => u.id === winner_id);
    const loserRankRow = userRanks.rows.find(u => u.id === loser_id);

    const winnerRankIndex = ranks.indexOf(winnerRankRow.rank || 'Unranked');
    const loserRankIndex = ranks.indexOf(loserRankRow.rank || 'Unranked');

    // Update winner: promote 1 step
    const newWinnerRank = ranks[Math.min(winnerRankIndex + 1, ranks.length - 1)];
    // Update loser: demote 1 step
    const newLoserRank = ranks[Math.max(loserRankIndex - 1, 0)];
      console.log(newWinnerRank, newLoserRank);
    await pool.query(`
      UPDATE users SET rank = CASE 
        WHEN id = $1 THEN $2 
        WHEN id = $3 THEN $4 
      END
      WHERE id IN ($1, $3)
    `, [winner_id, newWinnerRank, loser_id, newLoserRank]);

    res.status(200).json({ message: 'Result submitted and ranks updated' });
  } catch (error) {
    console.error("Error submitting match result:", error);
    res.status(500).json({ error: 'Failed to submit result' });
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