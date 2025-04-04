const Tournament = require('../Models/Tournaments');

exports.createTournament = async (req, res) => {
  try {
    console.log("came to controller");
    const { name, game, start_date, end_date, created_by ,members_per_match} = req.body;
    const tournament = await Tournament.create({ name, game, start_date, end_date, created_by,members_per_match });
    res.status(201).json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;


    const result = await Tournament.delete(id);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};