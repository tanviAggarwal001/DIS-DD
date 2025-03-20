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

    // Create new user & hash password
    const newUser = new userModel({ name, email, password });
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

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
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET, // ✅ Correct env variable
      { expiresIn: "24h" }
    );
    console.log(jwtToken);
    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    console.error("❌ Error in Login:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { signup, login };
