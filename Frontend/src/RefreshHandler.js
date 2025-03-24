import { useEffect } from 'react';

const RefreshHandler = ({ setIsAuthenticated, setIsAdminAuthenticated }) => {
  useEffect(() => {
    // Check for user authentication
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    
    // Check for admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, [setIsAuthenticated, setIsAdminAuthenticated]);

  return null;
};

export default RefreshHandler;