// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const userAuth = async (req, res, next) => {
//   try {
//     let token;

//     // Check for token in Authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // Check if token exists
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. No token provided.",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Find user
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. User not found.",
//       });
//     }

//     // Add user to request object
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("User auth middleware error:", error);
    
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. Invalid token.",
//       });
//     } else if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. Token expired.",
//       });
//     }
    
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };

// module.exports = userAuth;