import React, { useState } from 'react';
import axios from 'axios';
import './AddGame.css'; 

const AddGame = () => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !genre) {
      alert("Please enter both name and genre.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:5000/games', { name, genre });
      setName('');
      setGenre('');
      
      // Use a more elegant notification instead of alert
      const notification = document.createElement('div');
      notification.className = 'success-notification';
      notification.textContent = 'Game added successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding game:', error);
      alert("Failed to add game.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-game-container">
      <h2>Add New Game</h2>
      <form className="add-game-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="game-name">Game Name</label>
          <input 
            id="game-name"
            type="text" 
            placeholder="Enter game name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="game-genre">Genre</label>
          <input 
            id="game-genre"
            type="text" 
            placeholder="Enter game genre" 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)} 
          />
        </div>
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Game'}
        </button>
      </form>
    </div>
  );
};

export default AddGame;