import React from 'react'
import CreateTournament from '../components/CreateTournament';
import { Link } from 'react-router-dom';
import AllTournaments from '../components/AllTournaments';
function UserTournaments() {
  return (
    <div>
       <Link to="/home">Dashboard</Link>
       <CreateTournament/>
       <AllTournaments/>
    </div>
  )
}

export default UserTournaments
