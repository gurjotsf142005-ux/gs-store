const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

// Helper function to sign a 30-day login session token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret_key",
    { expiresIn: "30d" }
  );
};

// @desc    Register a brand new user (Automatic Admin check rule integrated)
// @route   POST /api/user/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "❌ Please add all required fields." });
    }

    // Guard Check: Verify duplicate data instances inside MongoDB cluster
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "❌ Email already registered!" });
    }

    // ⚡ AUTOMATIC ADMIN ASSIGNMENT RULE: 
    // If you register with this email, you are instantly configured as the master shop owner!
    const determinedRole = email === "gurjotsf@gmail.com" ? "admin" : "user";

    const newUser = await User.create({ 
      name, 
      email, 
      password,
      isVerified: true, // Activated instantly since email OTP is paused
      role: determinedRole
    });

    res.status(201).json({
      success: true,
      message: `🎉 Account created successfully as standard ${determinedRole}! Proceeding to log you in.`,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      token: generateToken(newUser)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `💥 Registration failed: ${error.message}` });
  }
};

// @desc    Login existing authenticated users
// @route   POST /api/user/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "❌ Invalid Email or Password" });
    }

    const isMatch = await require("bcryptjs").compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "❌ Invalid Email or Password" });
    }

    res.status(200).json({
      success: true,
      message: "🔒 Login successful! Welcome to GS Store.",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `💥 Login failed: ${error.message}` });
  }
};