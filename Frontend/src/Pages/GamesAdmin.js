import React, { useState } from 'react';
import axios from 'axios';
import './AddGame.css'; 

const AddGame = () => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !genre) {
      alert("Please enter both name and genre.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/games', { name, genre });
      alert("Game added successfully!");
      setName('');
      setGenre('');
    } catch (error) {
      console.error('Error adding game:', error);
      alert("Failed to add game.");
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
        <button className="submit-button" type="submit">Add Game</button>
      </form>
    </div>
  );
};

export default AddGame;