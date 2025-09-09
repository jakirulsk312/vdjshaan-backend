// // backend/routes/upload.js
// const express = require("express");
// const multer = require("multer");
// const streamifier = require("streamifier");
// const cloudinary = require("../config/cloudinary");

// const router = express.Router();
// const upload = multer(); // in-memory storage

// router.post("/", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const streamUpload = (reqFile) => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "vdjshaansite" },
//         (error, result) => {
//           if (result) resolve(result);
//           else reject(error);
//         }
//       );
//       streamifier.createReadStream(reqFile.buffer).pipe(stream);
//     });
//   };

//   try {
//     const result = await streamUpload(req.file);
//     res.json({ url: result.secure_url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

// module.exports = router;


require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const router = express.Router();
const upload = multer();

// Cloudinary config (from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Dynamic folder → ?folder=albums OR ?folder=gallery
    const folder = req.query.folder || "general";

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message,
    });
  }
});

module.exports = router;
