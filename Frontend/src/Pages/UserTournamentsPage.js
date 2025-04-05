import React from 'react'
import UpcomingTournaments from '../components/UpcomingTournaments'
import { Link } from 'react-router-dom'

function UserTournamentsPage() {
  return (
    <div>
        <Link to="/home">Dashboard</Link>
      <UpcomingTournaments/>
    </div>
  )
}

export default UserTournamentsPage
