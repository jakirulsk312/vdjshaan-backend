const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};