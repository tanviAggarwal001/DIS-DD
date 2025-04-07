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

  // Fetch userId from localStorage on mount
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

  // Fetch tournaments and registrations once userId is available
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

  const handleViewMatch = async (tournamentId) => {
    if (selectedTournamentId === tournamentId) {
      // toggle off
      setSelectedTournamentId(null);
      setTournamentMatches([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/matches/user/${userId}`);
      const filtered = res.data.filter(m => m.tournament_id === tournamentId);
      setTournamentMatches(filtered);
      // console.log(filtered);
      setSelectedTournamentId(tournamentId);
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
                          </tr>
                        </thead>
                        <tbody>
                          {tournamentMatches.map((match) => {
                            const isPlayer1 = match.player1_id === userId;
                            const opponent = isPlayer1 ? match.player2_name : match.player1_name;

                            return (
                              <tr key={match.id}>
                                <td>{opponent}</td>
                                <td>{match.status}</td>
                                <td>{match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : 'TBD'}</td>
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