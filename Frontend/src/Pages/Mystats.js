import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Mystats.css';


const MyStats = () => {
  const [userId, setUserId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const storedUsername = localStorage.getItem("LogginUser");
    if (storedUsername) {
      axios
        .get(`http://localhost:5000/user-id/${storedUsername}`)
        .then((res) => {
          const id = res.data.id;
          setUserId(id);
          fetchMatches(id);
        })
        .catch((err) => console.error("Error fetching user ID:", err));
    }
  }, []);

  const fetchMatches = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/matches/user/${id}`);
      const matchData = res.data;
      setMatches(matchData);

      // Fetch scores for each match
      const scoresData = {};
      await Promise.all(
        matchData.map(async (match) => {
          try {
            const scoreRes = await axios.get(`http://localhost:5000/scores/match/${match.id}`);
            scoresData[match.id] = scoreRes.data;
          } catch (err) {
            console.warn(`No scores for match ${match.id}`);
            scoresData[match.id] = [];
          }
        })
      );
      setScores(scoresData);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const getOpponentName = (match) => {
    return match.player1_id === userId ? match.player2_name : match.player1_name;
  };

  const getResultMessage = (match) => {
    if (!match.winner_id) return 'Result Pending';
    return match.winner_id === userId ? 'You won!' : 'You lost!';
  };

  const getFinalScore = (matchId) => {
    const matchScores = scores[matchId];
    if (!matchScores || matchScores.length < 2) return 'N/A';
    return `${matchScores[0].name}: ${matchScores[0].score} | ${matchScores[1].name}: ${matchScores[1].score}`;
  };

  const getWinnerName = (match) => {
    if (!match.winner_id) return 'TBD';
    const matchScores = scores[match.id];
    const winner = matchScores?.find(p => p.player_id === match.winner_id);
    return winner?.name || 'TBD';
  };

  return (
    <>
    <header className="admin-header">
                    <h1>Game Management</h1>
                    <Link to="/home" className="dashboard-link">
                        Back to Dashboard
                    </Link>
                </header>
    <div className="my-stats-container">
      <h2>My Match Stats</h2>
      {matches.length === 0 ? (
        <p>No matches played yet.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Opponent</th>
              <th>Winner</th>
              <th>Final Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <tr key={match.id}>
                <td>{getOpponentName(match)}</td>
                <td>{getWinnerName(match)}</td>
                <td>{getFinalScore(match.id)}</td>
                <td>{getResultMessage(match)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>

  );
};

export default MyStats;
