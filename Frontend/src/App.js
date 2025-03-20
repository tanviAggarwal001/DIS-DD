import React, { useState } from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Home from './Pages/Home';
import RefreshHandler from './RefreshHandler';
import "./App.css"
function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);

  const PrivateRoute= ({element})=>{
    return isAuthenticated? element : <Navigate to = '/login' />
  }
  return (
    <div className='App'>
      <RefreshHandler setisAuthenticated={setisAuthenticated}/>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/home' element={<PrivateRoute element={<Home/>}/>} />

      </Routes>

    </div>
  )
}

export default App
