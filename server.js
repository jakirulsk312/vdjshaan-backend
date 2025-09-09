
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./routes/admin");
const songRoutes = require("./routes/song");
const authRoutes = require("./routes/auth");
const albumRoutes = require("./routes/album");
const orderRoutes = require("./routes/order");
const downloadRoutes = require("./routes/download");
const eventRoutes  = require("./routes/eventRoutes.js");
const galleryRoutes = require("./routes/galleryRoutes");
const uploadRoutes = require("./routes/upload");


require("dotenv").config();


const app = express();

// CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true
// }));
app.use(cors({
  origin: true,  // reflect request origin
  credentials: true
}));


// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/upload", uploadRoutes);
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);

});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully');
  process.exit(0);
});

