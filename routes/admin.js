
// routes/admin.js
const express = require("express");
const { registerAdmin, loginAdmin, getAdmins, getProfile } = require("../controllers/admin.controller");
const protect = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/all", protect, getAdmins);

module.exports = router;