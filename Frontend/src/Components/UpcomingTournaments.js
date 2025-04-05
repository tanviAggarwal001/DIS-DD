import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Usertournaments.css'; 

const UpcomingTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [logginUser, setLogginUser] = useState("");
  const [userId, setuserId] = useState(1);

  useEffect(() => {
    const storedUsername = localStorage.getItem("LogginUser");
    setLogginUser(storedUsername);
    console.log(storedUsername);

    if (storedUsername) {
      axios
        .get(`http://localhost:5000/user-id/${storedUsername}`)
        .then((res) => setuserId(parseInt(res.data.id)))
        .catch((err) => console.error("Error fetching user ID:", err));
    }
  }, []);

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

  const handleRegister = async (tournamentId) => {
    try {
      await axios.post('http://localhost:5000/participants/register', {
        tournament_id: tournamentId,
        user_id: userId,
      });
      setRegistered([...registered, tournamentId]);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTournaments();
      fetchRegistrations();
    }
  }, [userId]);

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id}>
              <td>{tournament.name}</td>
              <td>{tournament.game_id}</td>
              <td>{tournament.start_date}</td>
              <td>{tournament.end_date}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingTournaments;