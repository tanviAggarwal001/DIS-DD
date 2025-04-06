import React from 'react';
import AddGame from './GamesAdmin';
import GameList from './GamesUser';
import { Link } from 'react-router-dom';
import './AdminGames.css';

function AdminGames() {
    return (
        <div className="admin-games-container">
            <header className="admin-header">
                <h1>Game Management</h1>
                <Link to="/admin/dashboard" className="dashboard-link">
                    Back to Dashboard
                </Link>
            </header>
            
            <div className="admin-content">
                <div className="game-management-container">
                    <GameList />
                    <AddGame />
                </div>
            </div>
        </div>
    );
}

export default AdminGames;