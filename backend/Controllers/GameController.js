const gameModel = require('../Models/Games');

// Fetch all games
exports.getAllGames = async (req, res) => {
  try {
    const games = await gameModel.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new game (Admin only)
exports.addGame = async (req, res) => {
  try {
    const { name, genre } = req.body;

    // Simple validation
    if (!name || !genre) {
      return res.status(400).json({ error: 'Name and Genre are required' });
    }

    const newGame = await gameModel.create(name, genre);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add game' });
  }
};

// Update an existing game
exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genre } = req.body;
    
    // Simple validation
    if (!name && !genre) {
      return res.status(400).json({ error: 'At least one field (name or genre) is required for update' });
    }
    
    // Check if game exists
    const existingGame = await gameModel.findById(id);
    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const updatedGame = await gameModel.update(id, { name, genre });
    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game' });
  }
};

// Delete a game
exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gameModel.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

module.exports = exports;