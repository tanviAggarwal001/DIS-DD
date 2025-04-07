import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GameList.css';
import { Link } from 'react-router-dom'


const UserGameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/games');
            setGames(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching games:', error);
            setLoading(false);
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
            <div className="game-list-container">
                <h2>Game Library</h2>

                {loading ? (
                    <p className="no-games">Loading games...</p>
                ) : games.length === 0 ? (
                    <p className="no-games">No games available. Add some games to get started.</p>
                ) : (
                    <div className="games-grid">
                        {games.map(game => (
                            <div key={game.id} className="game-card">
                                <h3 className="game-name">{game.name}</h3>
                                <span className="game-genre">{game.genre}</span>

                            </div>
                        ))}
                    </div>
                )}

                <button className="refresh-button" onClick={fetchGames}>
                    Refresh Games
                </button>
            </div>
        </>

    );
};

export default UserGameList;