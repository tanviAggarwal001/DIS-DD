const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for regular users
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "No token provided, authorization denied", 
        success: false 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(401).json({ 
      message: "Invalid token, authorization denied", 
      success: false 
    });
  }
};

// Middleware to verify JWT token for admin users
const verifyAdminToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "No token provided, admin authorization denied", 
        success: false 
      });
    }

    // Verify token using admin secret or fallback to regular secret
    const secretKey = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    
    // Check if the user has admin role
    if (!decoded.role || (decoded.role !== 'admin' && decoded.role !== 'super')) {
      return res.status(403).json({ 
        message: "Access denied: Admin privileges required", 
        success: false 
      });
    }
    
    // Add admin data to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("❌ Admin auth middleware error:", error);
    return res.status(401).json({ 
      message: "Invalid admin token, authorization denied", 
      success: false 
    });
  }
};

// Middleware for super admin only routes
const verifySuperAdmin = (req, res, next) => {
  try {
    // We assume verifyAdminToken middleware has already run
    if (!req.admin || req.admin.role !== 'super') {
      return res.status(403).json({ 
        message: "Access denied: Super admin privileges required", 
        success: false 
      });
    }
    
    next();
  } catch (error) {
    console.error("❌ Super admin auth middleware error:", error);
    return res.status(403).json({ 
      message: "Super admin authorization failed", 
      success: false 
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdminToken,
  verifySuperAdmin
};