import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const username = localStorage.getItem('LogginUser');
    if (username) {
      axios
        .get(`http://localhost:5000/user-id/${username}`)
        .then((res) => {
          setUserId(res.data.id);
        })
        .catch((err) => console.error('Error fetching user ID:', err));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/users/${userId}`)
        .then((res) => {
          setUser(res.data);
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
          });
        })
        .catch((err) => console.error('Error fetching user data:', err));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${userId}`, formData);
      const updatedUser = await axios.get(`http://localhost:5000/users/${userId}`);
      setUser(updatedUser.data);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (!user) return (
    <div className="profile-container">
      <div>Loading profile...</div>
    </div>
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <Link to="/home" className="dashboard-link">
          Back to Dashboard
        </Link>
      </header>
      
      <div className="profile-card-container">
        <h2>Player Profile</h2>
        <div className="profile-card">
          <div><strong>Name:</strong> {editMode ?
            <input name="name" value={formData.name} onChange={handleChange} /> : user.name}
          </div>
          <div><strong>Player ID:</strong> PLR{user.id}</div>
          <div><strong>Email:</strong> {editMode ?
            <input name="email" value={formData.email} onChange={handleChange} /> : user.email}
          </div>
          <div><strong>Current Rank:</strong> {user.rank || 'Unranked'}</div>

          <div>
            {editMode ? (
              <>
                <button onClick={handleUpdate} className="save-btn">Save</button>
                <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;