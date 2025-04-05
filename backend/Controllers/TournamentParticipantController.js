const Participant = require('../Models/Tournamentparticipants');

exports.register = async (req, res) => {
  try {
    const { tournament_id, user_id } = req.body;
    const entry = await Participant.register(tournament_id, user_id);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Participant.findByUser(userId);
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
