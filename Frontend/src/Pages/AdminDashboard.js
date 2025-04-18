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
          <Link to="/admin/stats" className="nav-link">Overall Stats</Link>
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
                <li>Publish results</li>
              </ul>
              <Link to="/admin/tournaments" className="action-button">Manage Tournaments</Link>
            </div>
            <div className="dashboard-card">
              <h3>Getting Statistics</h3>
              <ul>
                <li>View Number of Tournaments</li>
                <li>View Number of Matches</li>
                <li>View all users</li>
              </ul>
              <Link to="/admin/stats" className="action-button">View</Link>
            </div>
            <div className="dashboard-card">
              <h3>Game Management</h3>
              <ul>
                <li>Add new games</li>
                <li>Update game details</li>
                <li>Manage game categories</li>
              </ul>
              <Link to="/admin/games" className="action-button">Manage Games</Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;