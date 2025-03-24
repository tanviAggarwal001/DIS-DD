const bcrypt = require("bcrypt");
const adminModel = require("../Models/Users");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    // Generate JWT token
    const adminToken = jwt.sign(
      { 
        email: admin.email, 
        id: admin.id, 
        role: admin.role 
      },
      process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    
    res.status(200).json({
      message: "Admin login successful",
      success: true,
      adminToken,
      admin: {
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("❌ Error in Admin Login:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password, adminSecret } = req.body;

    // Verify admin registration secret
    if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({ 
        message: "Unauthorized: Invalid admin registration secret", 
        success: false 
      });
    }

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ 
        message: "Admin with this email already exists", 
        success: false 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin
    await adminModel.create({ 
      username, 
      email, 
      password: hashedPassword,
      role: req.body.role || 'admin'
    });

    res.status(201).json({ 
      message: "Admin registered successfully", 
      success: true 
    });
  } catch (error) {
    console.error("❌ Error in Admin Registration:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    // Only super admins can see all admins
    if (req.admin.role !== 'super') {
      return res.status(403).json({ 
        message: "Forbidden: Insufficient permissions", 
        success: false 
      });
    }
    
    const admins = await adminModel.findAll();
    res.status(200).json({ 
      admins, 
      success: true 
    });
  } catch (error) {
    console.error("❌ Error fetching admins:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { 
  adminLogin, 
  registerAdmin,
  getAllAdmins
};