const express = require("express");
const { downloadAlbum } = require("../controllers/order.controller");
const userAuth = require("../middleware/userAuth");

const router = express.Router();

// GET /api/download/:albumId
router.get("/:albumId", userAuth, downloadAlbum);

module.exports = router;