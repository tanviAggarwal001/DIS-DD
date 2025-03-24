import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import './Auth.css';

const AdminLogin = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Add useEffect to check for existing admin token and redirect to dashboard
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("All fields are required");
    }

    try {
      const url = "http://localhost:5000/admin/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, adminToken, admin, error } = result;

      if (success) {
        handleSuccess(message);
        if (adminToken) {
          localStorage.setItem("adminToken", adminToken);
          localStorage.setItem("adminUsername", admin.username);
          localStorage.setItem("adminRole", admin.role);
          
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        } else {
          handleError("Login failed. No token received.");
        }
      } else if (error?.details) {
        handleError(error.details[0]?.message || "An error occurred");
      } else {
        handleError(message || "Admin login failed");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    }
  };

  const handleUserLogin = () => {
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Admin Portal</h1>
        <p className="subtitle">Login to admin dashboard</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>

          <button type="submit" className="auth-button">
            Admin Log In
          </button>
        </form>

        {/* New button to navigate back to user login */}
        <div className="user-login-section">
          <div className="divider">
            <span>or</span>
          </div>
          <button 
            onClick={handleUserLogin} 
            className="auth-button"
          >
            Return to User Login
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminLogin;