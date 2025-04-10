// controllers/UserController.js
const userModel = require('../Models/Users');

const UserController = {
  getUserProfile: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUserProfile: async (req, res) => {
    const userId = req.params.id;
    const { name, email} = req.body;
    try {
      const updatedUser = await userModel.updatePartial(userId, { name, email});
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = UserController;
