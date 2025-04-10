import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditTournament.css';

const EditTournamentModal = ({ tournament, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    game_id: '',
    start_date: '',
    end_date: '',
    members_per_match: ''
  });

  const [games, setGames] = useState([]);

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name,
        game_id: tournament.game_id,
        start_date: tournament.start_date,
        end_date: tournament.end_date,
        members_per_match: tournament.members_per_match,
      });
    }
  }, [tournament]);

  useEffect(() => {
    axios.get('http://localhost:5000/games')
      .then(res => setGames(res.data))
      .catch(err => console.error("Error fetching games:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tournaments/${tournament.id}`, formData);
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating tournament:', err);
      alert('Failed to update tournament');
    }
  };

  if (!tournament) return null;

  const isOngoing = tournament.status === 'ongoing';
  const isCompleted = tournament.status === 'completed';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Tournament</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isCompleted}
            required
          />

          <select
            name="game_id"
            value={formData.game_id}
            onChange={handleChange}
            disabled={isOngoing || isCompleted}
          >
            <option value="">Select Game</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            disabled={isOngoing || isCompleted}
            required
          />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            disabled={isCompleted}
            required
          />

          <input
            type="number"
            name="members_per_match"
            value={formData.members_per_match}
            onChange={handleChange}
            disabled={isOngoing || isCompleted}
            required
          />

          <button type="submit" disabled={isCompleted}>Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditTournamentModal;
