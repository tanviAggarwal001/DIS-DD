import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './Admin.css';
import './Home.css';
import bgImage from './UI Assets/bg-image-valo1.png'

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({
    username: localStorage.getItem('adminUsername') || '',
    role: localStorage.getItem('adminRole') || 'admin'
  });

  const navigate = useNavigate();

  // Improved data fetching function to handle both users and admins
  const fetchAllData = async (token) => {
    setLoading(true);
    try {
      // Fetch users data
      const usersResponse = await fetch('http://localhost:5000/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersData = await usersResponse.json();
      setUserData(usersData.users || []);

      // Fetch admin data if the role is super
      if (adminInfo.role === 'super') {
        const adminsResponse = await fetch('http://localhost:5000/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!adminsResponse.ok) {
          throw new Error('Failed to fetch admin data');
        }
        
        const adminsData = await adminsResponse.json();
        setAdminData(adminsData.admins || []);
      }

      setLoading(false);
      handleSuccess('Data loaded successfully');
    } catch (error) {
      handleError('Failed to fetch data');
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Check if admin is authenticated and fetch data
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    } else {
      // Fetch data immediately when component mounts
      fetchAllData(adminToken);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      fetchAllData(adminToken);
    }
  };


return (
<div className="home-container">
      <nav className="home-nav">
        <div className="nav-brand">
          <span className="brand-text">DOSA DOMINATORS</span>
          <span className="brand-subtitle">ESPORTS</span>
        </div>
        <div className="nav-links">
          <Link to="/admin/profile" className="nav-link">Profile</Link>
          <Link to="/admin/tournaments" className="nav-link">Tournaments</Link>
          <Link to="/admin/games" className="nav-link">Games</Link>
        </div>
        <div className="nav-actions">
        <button onClick={handleRefresh}  className="logout-button">
              Refresh Data
            </button>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
          <ToastContainer />
        </div>
      </nav>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Dosa Dominators Esports</h1>
            <p>Join South Asia's premier competitive gaming community</p>
            <p className="hero-subtitle">Compete • Win • Dominate</p>
          </div>
        </section>

       
          <section className="admin-dashboard">
            <h2>Admin Control Panel</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Tournament Management</h3>
                <ul>
                  <li>Create new tournaments</li>
                  <li>Manage existing tournaments</li>
                  <li>Approve tournament requests</li>
                </ul>
                <button className="action-button">Manage Tournaments</button>
              </div>
              <div className="dashboard-card">
                <h3>User Management</h3>
                <ul>
                  <li>View all users</li>
                  <li>Ban/unban users</li>
                  <li>Manage user roles</li>
                </ul>
                <button className="action-button">Manage Users</button>
              </div>
              <div className="dashboard-card">
                <h3>Game Management</h3>
                <ul>
                  <li>Add new games</li>
                  <li>Update game details</li>
                  <li>Manage game categories</li>
                </ul>
                <button className="action-button">Manage Games</button>
              </div>
            </div>
          </section>
       
          <section className="featured-tournaments">
          <h2>Featured Tournaments</h2>
          <div className="tournament-grid">
            <div className="tournament-card">
              <div className="tournament-header">
                <h3>VALORANT Championship</h3>
                <span className="tournament-status">Registering</span>
              </div>
              <div className="tournament-details">
                <p className="prize-pool">Prize Pool: $10,000</p>
                <p className="tournament-date">March 25, 2024</p>
                <p className="tournament-slots">Slots: 16/32</p>
              </div>
              <button className="join-button">Join Now</button>
            </div>
            <div className="tournament-card">
              <div className="tournament-header">
                <h3>CS:GO Masters</h3>
                <span className="tournament-status">Starting Soon</span>
              </div>
              <div className="tournament-details">
                <p className="prize-pool">Prize Pool: $5,000</p>
                <p className="tournament-date">March 30, 2024</p>
                <p className="tournament-slots">Slots: 24/32</p>
              </div>
              <button className="join-button">Join Now</button>
            </div>
            <div className="tournament-card">
              <div className="tournament-header">
                <h3>Apex Legends Cup</h3>
                <span className="tournament-status">Open</span>
              </div>
              <div className="tournament-details">
                <p className="prize-pool">Prize Pool: $7,500</p>
                <p className="tournament-date">April 5, 2024</p>
                <p className="tournament-slots">Slots: 8/32</p>
              </div>
              <button className="join-button">Join Now</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;