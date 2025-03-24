import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './Admin.css';

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
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-info">
          <span>Welcome, {adminInfo.username} ({adminInfo.role})</span>
          <div className="header-actions">
            <button onClick={handleRefresh} className="refresh-button">
              Refresh Data
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            <section className="data-section">
              <h2>Users</h2>
              {userData.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found</p>
              )}
            </section>

            {adminInfo.role === 'super' && (
              <section className="data-section">
                <h2>Admins</h2>
                {adminData.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.map(admin => (
                        <tr key={admin.id}>
                          <td>{admin.id}</td>
                          <td>{admin.username}</td>
                          <td>{admin.email}</td>
                          <td>{admin.role}</td>
                          <td>{new Date(admin.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No admin records found</p>
                )}
              </section>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;