import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils"; // Utility for showing success message
import './Home.css';
import bgImage from './UI Assets/bg-image-valo1.png'

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

export default Home; 