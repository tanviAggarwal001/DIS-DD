import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Usertournaments.css';
import { Link } from 'react-router-dom';

const UpcomingTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [matchScores, setMatchScores] = useState({});

  useEffect(() => {
    const storedUsername = localStorage.getItem("LogginUser");
    if (storedUsername) {
      axios
        .get(`http://localhost:5000/user-id/${storedUsername}`)
        .then((res) => {
          setUserId(parseInt(res.data.id));
        })
        .catch((err) => console.error("Error fetching user ID:", err));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchTournaments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/tournaments');
        const upcoming = res.data.filter(t => t.status === 'upcoming');
        setTournaments(upcoming);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
      }
    };

    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/participants/${userId}`);
        const registeredIds = res.data.map(r => r.tournament_id);
        setRegistered(registeredIds);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      }
    };

    fetchTournaments();
    fetchRegistrations();
  }, [userId]);

  const handleRegister = async (tournamentId) => {
    try {
      await axios.post('http://localhost:5000/participants/register', {
        tournament_id: tournamentId,
        user_id: userId,
      });
      setRegistered(prev => [...prev, tournamentId]);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const fetchMatchScores = async (matches) => {
    const scoreMap = {};

    for (const match of matches) {
      if (match.status === 'completed') {
        try {
          const res = await axios.get(`http://localhost:5000/scores/match/${match.id}`);
          scoreMap[match.id] = res.data;
        } catch (err) {
          console.error(`Error fetching score for match ${match.id}:`, err);
          scoreMap[match.id] = null;
        }
      }
    }

    setMatchScores(scoreMap);
  };

  const handleViewMatch = async (tournamentId) => {
    if (selectedTournamentId === tournamentId) {
      setSelectedTournamentId(null);
      setTournamentMatches([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/matches/user/${userId}`);
      const filtered = res.data.filter(m => m.tournament_id === tournamentId);
      setTournamentMatches(filtered);
      setSelectedTournamentId(tournamentId);
      await fetchMatchScores(filtered);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  return (
    <div className="upcoming-tournaments-container">
      <h2>Upcoming Tournaments</h2>
      <table className="upcoming-tournaments-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Game</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
            <th>View Match</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <React.Fragment key={tournament.id}>
              <tr>
                <td>{tournament.name}</td>
                <td>{tournament.game_id}</td>
                <td>{new Date(tournament.start_date).toLocaleDateString()}</td>
                <td>{new Date(tournament.end_date).toLocaleDateString()}</td>
                <td>
                  <span className="status-upcoming">{tournament.status}</span>
                </td>
                <td>
                  {!registered.includes(tournament.id) ? (
                    <button
                      onClick={() => handleRegister(tournament.id)}
                      className="register-button"
                    >
                      Register
                    </button>
                  ) : (
                    <span className="registered-text">Registered</span>
                  )}
                </td>
                <td>
                  <button
                    className="view-match-button"
                    onClick={() => handleViewMatch(tournament.id)}
                  >
                    {selectedTournamentId === tournament.id ? "Hide Matches" : "View Match"}
                  </button>
                </td>
              </tr>

              {selectedTournamentId === tournament.id && (
                <tr>
                  <td colSpan="7">
                    {tournamentMatches.length === 0 ? (
                      <p>No scheduled matches yet for this tournament.</p>
                    ) : (
                      <table className="match-subtable">
                        <thead>
                          <tr>
                            <th>Opponent</th>
                            <th>Status</th>
                            <th>Scheduled At</th>
                            <th>Results</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tournamentMatches.map((match) => {
                            const isPlayer1 = match.player1_id === userId;
                            const opponent = isPlayer1 ? match.player2_name : match.player1_name;
                            const scores = matchScores[match.id];

                            let resultMessage = '';
                            let finalScore = '';
                            let winnerName = '';

                            if (scores && scores.length === 2) {
                              const playerScore = scores.find(s => s.player_id === userId)?.score ?? 0;
                              const opponentScore = scores.find(s => s.player_id !== userId)?.score ?? 0;

                              finalScore = `${playerScore} - ${opponentScore}`;
                              winnerName = match.winner_id === userId ? "You" : scores.find(s => s.player_id === match.winner_id)?.username || 'Opponent';
                              resultMessage = match.winner_id === userId ? "You won!" : "You lost!";
                            }

                            return (
                              <tr key={match.id}>
                                <td>{opponent}</td>
                                <td>{match.status}</td>
                                <td>{match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : 'TBD'}</td>
                                <td>
                                  {match.status === 'completed' && scores ? (
                                    <>
                                      <div><strong>Winner:</strong> {winnerName}</div>
                                      <div><strong>Final Score:</strong> {finalScore}</div>
                                      <div><em>{resultMessage}</em></div>
                                    </>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingTournaments;
