import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './Auth.css';
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const [logInfo, setLogInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Add useEffect to check for existing token and redirect to home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = logInfo;

    if (!email || !password) {
      return handleError("Fields are empty");
    }

    try {
      const url = "http://localhost:5000/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        if (jwtToken) {
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("LogginUser", name);
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          handleError("Login failed. No token received.");
        }
      } else if (error?.details) {
        handleError(error.details[0]?.message || "An error occurred");
      } else {
        handleError(message || "Login failed");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    }
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back</h1>
        <p className="subtitle">Log in to your account</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={logInfo.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={logInfo.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        <div className="admin-login-section">
          <div className="divider">
            <span>or</span>
          </div>
          <button 
            onClick={handleAdminLogin} 
            className="auth-button"
          >
            Login as Admin
          </button>
        </div>

        <ToastContainer />

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;