import React from 'react';
import CreateTournament from '../Components/CreateTournament';
import { Link } from 'react-router-dom';
import AllTournaments from '../Components/AllTournaments';
import './AdminTournaments.css';

function UserTournaments() {
  return (
    <div className="admin-tournaments-page">
      <header className="admin-header">
        <h1>Tournament Management</h1>
        <Link to="/admin/dashboard" className="dashboard-link">
          <span className="dashboard-icon">🏠</span> Dashboard
        </Link>
      </header>
      
      <div className="admin-content-container">
        <div className="tournaments-grid">
          <div className="create-tournament-column">
            <CreateTournament />
          </div>
          <div className="view-tournaments-column">
            <AllTournaments />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTournaments;