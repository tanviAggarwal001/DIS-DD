import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './ScheduleMatches.css';

const ScheduleMatch = () => {
  const { tournamentId } = useParams();
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (tournamentId) {
      axios
        .get(`http://localhost:5000/participants/registered/${tournamentId}`)
        .then((res) => setPlayers(res.data))
        .catch((err) => console.error('Error fetching players:', err));
    }
  }, [tournamentId]);

  const handleSchedule = async () => {
    if (!player1 || !player2 || player1 === player2) {
      setMessage("Please select two different players.");
      return;
    }

    const p1 = Number(player1);
    const p2 = Number(player2);
    const tid = Number(tournamentId);
    
    console.log(p1, " ", p2, " ", tid);
    if (isNaN(p1) || isNaN(p2) || isNaN(tid)) {
      setMessage("❌ Invalid data. Please try again.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/matches', {
        tournament_id: tid,
        player1_id: p1,
        player2_id: p2
      });
      setMessage("✅ Match scheduled successfully!");
      setPlayer1('');
      setPlayer2('');
    } catch (err) {
      console.error("Error scheduling match:", err);
      setMessage("❌ Error scheduling match.");
    }
  };

  return (
    <>
    <header className="admin-header">
                <h1>Game Management</h1>
                <Link to="/admin/tournaments" className="dashboard-link">
                    Back to Tournaments
                </Link>
            </header>
    <div className="schedule-match-container">
      <h2>Schedule Match for Tournament ID: {tournamentId}</h2>

      <div className="dropdowns">
        <select value={player1} onChange={(e) => setPlayer1(e.target.value)}>
          <option value="">Select Player 1</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <select value={player2} onChange={(e) => setPlayer2(e.target.value)}>
          <option value="">Select Player 2</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSchedule} className="schedule-btn">
        📅 Schedule Match
      </button>

      {message && <p className="message">{message}</p>}
    </div>
    </>

  );
};

export default ScheduleMatch;