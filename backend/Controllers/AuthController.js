const bcrypt = require("bcrypt");
const userModel = require("../Models/Users");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists, please login to continue", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with hashed password
    const newUser = await userModel.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Sign Up Successful", success: true });
  } catch (error) {
    console.error("❌ Error in Signup:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is incorrect", success: false });
    }

    // Compare passwords
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(401).json({ message: "Email or password is incorrect", success: false });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error("❌ Error in Login:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    // Don't send password in response
    const { password, ...userData } = user;
    
    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { signup, login, getProfile };