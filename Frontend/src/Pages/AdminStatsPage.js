import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminStatsPage.css';
import { Link } from 'react-router-dom';


const AdminStatsPage = () => {
    const [stats, setStats] = useState({
      totalTournaments: 0,
      ongoingTournaments: 0,
      totalMatches: 0,
      totalPlayers: 0,
    });
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      fetchStatsAndUsers();
      fetchUsers();
    }, []);
  
    const fetchStatsAndUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/stats');
        setStats(res.data);
        
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin/users');
            setUsers(res.data);
        } catch (err) {
        console.error('Error fetching admin stats:', err);
            
        }
    };
  
    return (
        <>
        <header className="admin-header">
                        <Link to="/admin/dashboard" className="dashboard-link">
                            Back to Dashboard
                        </Link>
                    </header>
      <div className="admin-dashboard-container">
        <h2>OverAll Stats</h2>
                    
        <div className="stats-cards">
          <div className="card">
            <h4>Total Tournaments</h4>
            <p>{stats.totalTournaments}</p>
          </div>
          <div className="card">
            <h4>Ongoing Tournaments</h4>
            <p>{stats.ongoingTournaments}</p>
          </div>
          <div className="card">
            <h4>Total Matches</h4>
            <p>{stats.totalMatches}</p>
          </div>
          <div className="card">
            <h4>Total Players Registered</h4>
            <p>{stats.totalPlayers}</p>
          </div>
        </div>
  
        <div className="user-list-section">
          <h3>All Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.rank || 'Unranked'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>

    );
  };
  
  export default AdminStatsPage;
  