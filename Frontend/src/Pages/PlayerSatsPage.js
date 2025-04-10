import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';

const PlayerStatsPage = () => {
  const [stats, setStats] = useState({});
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem('LogginUser');
    setUsername(storedUsername);

    if (storedUsername) {
      fetchUserIdAndStats(storedUsername);
    }
  }, []);

  const fetchUserIdAndStats = async (username) => {
    try {
      const userRes = await axios.get(`http://localhost:5000/user-id/${username}`);
      const userId = userRes.data.id;
      const statsRes = await axios.get(`http://localhost:5000/user/${userId}/stats`);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching player stats:", err);
    }
  };

  return (
    <>
    <header className="admin-header">
                    <h1>Game Management</h1>
                    <Link to="/home" className="dashboard-link">
                        Back to Dashboard
                    </Link>
                </header>
    <div className="player-stats-container">
      <h2>{username}'s Performance Summary</h2>
      <div className="stats-cards">
        <div className="card"><h4>Matches Played</h4><p>{stats.matchesPlayed || 0}</p></div>
        <div className="card"><h4>Matches Won</h4><p>{stats.matchesWon || 0}</p></div>
        <div className="card"><h4>Win Rate</h4><p>{stats.winRate || 0}%</p></div>
        <div className="card"><h4>Tournaments Participated</h4><p>{stats.tournamentsParticipated || 0}</p></div>
        <div className="card"><h4>Average Score</h4><p>{stats.averageScore?.toFixed(2) || 0}</p></div>
      </div>
    </div>
    </>

  );
};

export default PlayerStatsPage;
