import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllTournaments.css';

const AllTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showPlayersFor, setShowPlayersFor] = useState(null);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tournaments');
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRegisteredPlayers = async (tournamentId) => {
    try {
      const res = await axios.get(`http://localhost:5000/participants/registered/${tournamentId}`);
      setSelectedPlayers(res.data);
      setShowPlayersFor(tournamentId);
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id) => {
    const updatedData = prompt('Enter updated details (name,game_id,start_date,end_date,members_per_match) comma separated');
    if (!updatedData) return;
    const [name, game_id, start_date, end_date, members_per_match] = updatedData.split(',');
    try {
      await axios.put(`http://localhost:5000/tournaments/${id}`, {
        name,
        game_id,
        start_date,
        end_date,
        members_per_match
      });
      fetchTournaments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="all-tournaments-container">
      <h2>All Tournaments</h2>
      <table className="all-tournaments-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Game</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id}>
              <td>{tournament.name}</td>
              <td>{tournament.game_id}</td>
              <td>{tournament.start_date}</td>
              <td>{tournament.end_date}</td>
              <td>{tournament.status}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(tournament.id)}>✏️ Edit</button>
                <button className="delete-button" onClick={() => handleDelete(tournament.id)}>🗑️ Delete</button>
                <button className="view-button" onClick={() => fetchRegisteredPlayers(tournament.id)}>👥 View Players</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPlayersFor && (
        <div className="registered-players-container">
          <h3>Registered Players for Tournament ID: {showPlayersFor}</h3>
          {selectedPlayers.length === 0 ? (
            <p>No players registered.</p>
          ) : (
            <ul>
              {selectedPlayers.map((player, index) => (
                <li key={index}>
                  {player.name} {player.rank ? `- Rank: ${player.rank}` : ''}
                </li>
              ))}
            </ul>
          )}
          <button className="close-button" onClick={() => setShowPlayersFor(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AllTournaments;