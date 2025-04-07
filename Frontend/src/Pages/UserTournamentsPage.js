import React from 'react'
import UpcomingTournaments from '../Components/UpcomingTournaments'
import { Link } from 'react-router-dom'

function UserTournamentsPage() {
  return (
    <div>
      <header className="admin-header">
        <h1>Game Management</h1>
        <Link to="/home" className="dashboard-link">
          Back to Dashboard
        </Link>
      </header>
      <UpcomingTournaments />
    </div>
  )
}

export default UserTournamentsPage
