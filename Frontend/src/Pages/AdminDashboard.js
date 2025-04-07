import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './Admin.css';
import './Home.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
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
      </main>
    </div>
  );
}

export default AdminDashboard;