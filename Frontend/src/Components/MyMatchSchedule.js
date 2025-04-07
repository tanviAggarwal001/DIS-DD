import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './MyMatchSchedules.css';

const MyMatchSchedules = () => {
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState('');
  const [logginUser, setLogginUser] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("LogginUser");
    setLogginUser(storedUsername);

    if (storedUsername) {
      axios
        .get(`http://localhost:5000/user-id/${storedUsername}`)
        .then((res) => setUserId(parseInt(res.data.id)))
        .catch((err) => {
          console.error("Error fetching user ID:", err);
          setMessage("Failed to get user ID");
        });
    } else {
      setMessage("Please log in to view your matches.");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/matches/user/${userId}`)
      .then((res) => {
        if (res.data.length === 0) {
          setMessage("You have no scheduled matches.");
        } else {
          setMatches(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setMessage("Something went wrong while fetching matches.");
      });
  }, [userId]);

  return (
    <div className="match-schedule-container">
      <h2>📅 My Match Schedules</h2>
      {message && <p className="info-message">{message}</p>}

      {matches.length > 0 && (
        <table className="match-table">
          <thead>
            <tr>
              <th>Tournament</th>
              <th>Opponent</th>
              <th>Status</th>
              <th>Result</th>
              <th>Scheduled At</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const isPlayer1 = match.player1_id === userId;
              const opponent = isPlayer1 ? match.player2_name : match.player1_name;
              const result =
                match.status === 'completed'
                  ? match.winner_id === userId
                    ? '🏆 You won'
                    : match.winner_id
                      ? '❌ You lost'
                      : 'Draw'
                  : '-';

              return (
                <tr key={match.id}>
                  <td>{match.tournament_name}</td>
                  <td>{opponent}</td>
                  <td>{match.status}</td>
                  <td>{result}</td>
                  <td>{new Date(match.scheduled_at).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyMatchSchedules;