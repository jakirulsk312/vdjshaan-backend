const express = require("express");
const { downloadAlbum } = require("../controllers/order.controller");

const router = express.Router();

// GET /api/download/:albumId?email=you@example.com
router.get("/:albumId", downloadAlbum);

module.exports = router;
