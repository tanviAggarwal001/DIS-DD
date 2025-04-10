import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditTournamentModal from './EditTournaments.js';
import './AllTournaments.css';

const AllTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showPlayersFor, setShowPlayersFor] = useState(null);
  const [showMatchesFor, setShowMatchesFor] = useState(null);
  const [matches, setMatches] = useState([]);
  const [scoreInputs, setScoreInputs] = useState({});
  const [editingTournament, setEditingTournament] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

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

 const fetchMatches = async (tournamentId) => {
  try {
    const res = await axios.get(`http://localhost:5000/matches/tournament/${tournamentId}`);
    const matchesWithScores = await Promise.all(res.data.map(async (match) => {
      const scoreRes = await axios.get(`http://localhost:5000/scores/match/${match.id}/check`);
      return {
        ...match,
        scoresSubmitted: scoreRes.data.submitted
      };
    }));
    setMatches(matchesWithScores);
    setShowMatchesFor(tournamentId);
  } catch (err) {
    console.error('Error fetching matches:', err);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreChange = (matchId, field, value) => {
    setScoreInputs(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: Number(value)
      }
    }));
  };

  const submitResult = async (match) => {
    const inputs = scoreInputs[match.id];
    if (!inputs?.player1_score || !inputs?.player2_score) {
      alert('Enter scores for both players');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/matches/${match.id}/submit-result`, {
        player1_id: match.player1_id,
        player2_id: match.player2_id,
        player1_score: inputs.player1_score,
        player2_score: inputs.player2_score
      });

      alert('Score submitted!');
      fetchMatches(showMatchesFor);
    } catch (err) {
      console.error('Error submitting score:', err);
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
            <th>Edit</th>
            <th>Delete</th>
            <th>View Players</th>
            <th>Schedule Matches</th>
            <th>View Matches</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id}>
              <td>{tournament.name}</td>
              <td>{tournament.game_name || 'Unknown'}</td>
              <td>{new Date(tournament.start_date).toLocaleDateString()}</td>
              <td>{new Date(tournament.end_date).toLocaleDateString()}</td>
              <td>{tournament.status}</td>
              <td>
                {tournament.status === 'completed' ? (
                  <span style={{ color: 'gray', fontStyle: 'italic' }} title="Cannot edit completed tournament">
                    ✏️
                  </span>
                ) : (
                  <button onClick={() => setEditingTournament(tournament)}>✏️</button>
                )}
              </td>
              <td><button onClick={() => handleDelete(tournament.id)}>🗑️</button></td>
              <td><button onClick={() => fetchRegisteredPlayers(tournament.id)}>👥</button></td>
              <td>
                {tournament.status === 'ongoing' ? (
                  <Link to={`/schedule-match/${tournament.id}`}>Schedule</Link>
                ) : (
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {tournament.status === 'completed' ? 'Tournament is over' : 'Not started yet'}
                  </span>
                )}
              </td>
              <td>
                {(tournament.status === 'ongoing' || tournament.status === 'completed') ? (
                <button onClick={() => fetchMatches(tournament.id)}>📋 Matches</button>
                 ) : ( 
                <span style={{ color: 'gray', fontStyle: 'italic' }}>Not available</span>
                )}
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
                  {player.name} {player.rank ? ` - Rank: ${player.rank}` : ''}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setShowPlayersFor(null)}>Close</button>
        </div>
      )}

      {showMatchesFor && (
        <div className="match-schedule-container">
          <h3>Matches for Tournament ID: {showMatchesFor}</h3>
          {matches.length === 0 ? (
            <p>No matches scheduled.</p>
          ) : (
            <table className="match-table">
              <thead>
                <tr>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Winner</th>
                  <th>Score</th>
                  <th>Submit Status</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.player1_name}</td>
                    <td>{match.player2_name}</td>
                    <td>{match.winner_name || 'Pending'}</td>
                    <td>
                      {match.scoresSubmitted ? (
                        match.status === 'completed' && match.player1_score != null && match.player2_score != null
                          ? `${match.player1_score} - ${match.player2_score}`
                          : '✅ Submitted'
                      ) : 'Not submitted'}
                    </td>

                    <td>
                      {match.status === 'completed' ? (
                        <span>✅ Done</span>
                      ) : (
                        <>
                          <input
                            type="number"
                            placeholder="P1"
                            onChange={(e) => handleScoreChange(match.id, 'player1_score', e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="P2"
                            onChange={(e) => handleScoreChange(match.id, 'player2_score', e.target.value)}
                          />
                          <button onClick={() => submitResult(match)}>Submit</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => setShowMatchesFor(null)}>Close Matches</button>
        </div>
      )}

      {editingTournament && (
        <EditTournamentModal
          tournament={editingTournament}
          onClose={() => setEditingTournament(null)}
          onUpdated={fetchTournaments}
        />
      )}
    </div>
  );
};

export default AllTournaments;
