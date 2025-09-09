// // backend/config/cloudinary.js
// const { v2: cloudinary } = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;



// backend/routes/upload.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Multer middleware - store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folder = req.query.folder || "uploads";

    // Convert buffer to base64 string for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "auto",
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err);
    res.status(500).json({ message: "Cloudinary upload failed", error: err });
  }
});

module.exports = router;
