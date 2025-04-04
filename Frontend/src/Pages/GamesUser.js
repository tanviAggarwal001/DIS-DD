import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GameList.css';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', genre: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/games');
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  // Open edit modal and set current game data
  const handleEditClick = (game) => {
    setEditingGame(game);
    setEditFormData({ name: game.name, genre: game.genre });
    setShowEditModal(true);
  };

  // Handle changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Submit the edited game
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.genre) {
      alert("Please enter both name and genre.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/games/${editingGame.id}`, editFormData);
      
      // Update state to reflect the change
      setGames(games.map(game => 
        game.id === editingGame.id ? { ...game, ...editFormData } : game
      ));
      
      // Reset and close modal
      setShowEditModal(false);
      setEditingGame(null);
      setEditFormData({ name: '', genre: '' });
      
      alert("Game updated successfully!");
    } catch (error) {
      console.error('Error updating game:', error);
      alert("Failed to update game.");
    }
  };

  // Handle delete game
  const handleDeleteClick = async (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        console.log(gameId);
        await axios.delete(`http://localhost:5000/games/${gameId}`);
        
        // Update state to remove the deleted game
        setGames(games.filter(game => game.id !== gameId));
        
        alert("Game deleted successfully!");
      } catch (error) {
        console.error('Error deleting game:', error);
        alert("Failed to delete game.");
      }
    }
  };

  // Close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingGame(null);
    setEditFormData({ name: '', genre: '' });
  };

  return (
    <div className="game-list-container">
      <h2>Game Library</h2>
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : games.length === 0 ? (
        <p className="no-games">No games available. Add some games to get started.</p>
      ) : (
        <div className="games-grid">
          {games.map(game => (
            <div key={game.id} className="game-card">
              <h3 className="game-name">{game.name}</h3>
              <span className="game-genre">{game.genre}</span>
              <div className="game-actions">
                <button 
                  className="edit-button" 
                  onClick={() => handleEditClick(game)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteClick(game.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="refresh-button" onClick={fetchGames}>
        Refresh Games
      </button>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit Game</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-name">Game Name</label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  placeholder="Enter game name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-genre">Genre</label>
                <input
                  id="edit-genre"
                  type="text"
                  name="genre"
                  value={editFormData.genre}
                  onChange={handleEditFormChange}
                  placeholder="Enter game genre"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameList;