

const express = require("express");
const {
  createSong,
  getAllSongs,
  getLatestSongs,
  getSongById,
  updateSong,
  deleteSong,
} = require("../controllers/song.controller");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllSongs);           // Public ----/api/songs
router.get("/latest", getLatestSongs);  // Public ------/api/songs/latest
router.get("/:id", getSongById);        // Public ----/api/songs/:id

router.post("/", protect, createSong);   // Protected-- /api/song
router.put("/:id", protect, updateSong); // Protected --PUT ----/api/songs/:id
router.delete("/:id", protect, deleteSong); // Protected --DELETE---- /api/songs/:id

module.exports = router;
