
// controllers/admin.controller.js
const AdminModel = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const admin = await AdminModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      data: { 
        id: admin._id, 
        email: admin.email,
        createdAt: admin.createdAt 
      },
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: { 
        id: admin._id, 
        email: admin.email,
        lastLogin: new Date()
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get all admins (protected route)
const getAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get current admin profile
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: req.admin,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getProfile,
};