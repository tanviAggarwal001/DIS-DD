import React from 'react'
import AddGame from './GamesAdmin'
import GameList from './GamesUser'
import { Link } from 'react-router-dom'
function AdminGames() {
    return (
        <div>
            <Link to="/admin/dashboard">Dashboard</Link>
            <GameList />
            <AddGame />
        </div>
    )
}

export default AdminGames
