const pool = require('../Models/db');

// 1. Create a new match
exports.create = async (req, res) => {
  const { tournament_id, player1_id, player2_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO matches (tournament_id, player1_id, player2_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [tournament_id, player1_id, player2_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating match:", err);
    res.status(500).json({ error: 'Failed to create match' });
  }
};

// 2. Get all matches in a tournament
exports.getByTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT m.*, 
              u1.username AS player1_name,
              u2.username AS player2_name,
              u3.username AS winner_name
       FROM matches m
       JOIN users u1 ON m.player1_id = u1.id
       JOIN users u2 ON m.player2_id = u2.id
       LEFT JOIN users u3 ON m.winner_id = u3.id
       WHERE m.tournament_id = $1`,
      [tournamentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// 3. Get all matches of a specific user
exports.getByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT m.*, 
              u1.username AS player1_name, 
              u2.username AS player2_name,
              t.name AS tournament_name,
              u3.username AS winner_name
       FROM matches m
       JOIN users u1 ON m.player1_id = u1.id
       JOIN users u2 ON m.player2_id = u2.id
       JOIN tournaments t ON m.tournament_id = t.id
       LEFT JOIN users u3 ON m.winner_id = u3.id
       WHERE m.player1_id = $1 OR m.player2_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user matches:", err);
    res.status(500).json({ error: 'Failed to get user matches' });
  }
};

// 4. Set match winner
exports.setWinner = async (req, res) => {
  const { matchId } = req.params;
  const { winner_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE matches SET winner_id = $1 WHERE id = $2 RETURNING *`,
      [winner_id, matchId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error setting winner:", err);
    res.status(500).json({ error: 'Failed to update winner' });
  }
};

// 5. Delete match (optional)
exports.delete = async (req, res) => {
  const { matchId } = req.params;

  try {
    await pool.query(`DELETE FROM matches WHERE id = $1`, [matchId]);
    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    console.error("Error deleting match:", err);
    res.status(500).json({ error: 'Failed to delete match' });
  }
};
