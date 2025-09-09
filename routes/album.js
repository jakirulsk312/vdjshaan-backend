const express = require("express");
const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} = require("../controllers/album.controller");
const protect = require("../middleware/auth"); // Admin auth

const router = express.Router();

// Public routes
router.get("/", getAllAlbums);           // GET /api/albums
router.get("/:id", getAlbumById);        // GET /api/albums/:id

// Protected routes (Admin only)
router.post("/", protect, createAlbum);           // POST /api/albums
router.put("/:id", protect, updateAlbum);         // PUT /api/albums/:id
router.delete("/:id", protect, deleteAlbum);      // DELETE /api/albums/:id

module.exports = router;