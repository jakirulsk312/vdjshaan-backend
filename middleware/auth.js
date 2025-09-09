
//middleware/auth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find admin
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin not found.",
      });
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token expired.",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = protect;