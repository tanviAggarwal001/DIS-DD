import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils"; 
import './Home.css';

function Home() {
  const [logginUser, setLogginUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLogginUser(localStorage.getItem("LogginUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("LogginUser");
    handleSuccess("Logout Successful!");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };


return (
<div className="home-container">
      <nav className="home-nav">
        <div className="nav-brand">
          <span className="brand-text">DOSA DOMINATORS</span>
          <span className="brand-subtitle">ESPORTS</span>
        </div>
        <div className="nav-links">
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/tournaments" className="nav-link">Tournaments</Link>
          <Link to="/games" className="nav-link">Games</Link>
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

      
          <section className="user-dashboard">
            <h2>Player Dashboard</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>My Tournaments</h3>
                <ul>
                  <li>Upcoming tournaments</li>
                  <li>Active tournaments</li>
                  <li>Tournament history</li>
                </ul>
                <button className="action-button">View All</button>
              </div>
              <div className="dashboard-card">
                <h3>My Stats</h3>
                <ul>
                  <li>Win rate: 65%</li>
                  <li>Tournaments won: 12</li>
                  <li>Current rank: Diamond</li>
                </ul>
                <button className="action-button">View Details</button>
              </div>
              <div className="dashboard-card">
                <h3>Quick Actions</h3>
                <ul>
                  <li>Join a tournament</li>
                  <li>View leaderboard</li>
                  <li>Update profile</li>
                </ul>
                <button className="action-button">View More</button>
              </div>
            </div>
          </section>
      </main>
    </div>
  );
}

export default Home;