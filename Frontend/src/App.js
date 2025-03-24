import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Home from './Pages/Home';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import RefreshHandler from './RefreshHandler';
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')  // Check if user token exists
  );
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    !!localStorage.getItem('adminToken')  // Check if admin token exists
  );

  // Regular user authentication check
  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element : <Navigate to='/login' />
  }
  
  // Admin authentication check
  const AdminRoute = ({element}) => {
    return isAdminAuthenticated ? element : <Navigate to='/admin/login' />
  }

  return (
    <div className='App'>
      <RefreshHandler 
        setIsAuthenticated={setIsAuthenticated} 
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
      <Routes>
        {/* User routes */}
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/home' element={<PrivateRoute element={<Home/>}/>} />
        
        {/* Admin routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminRoute element={<AdminDashboard/>}/>} />
      </Routes>
    </div>
  )
}

export default App