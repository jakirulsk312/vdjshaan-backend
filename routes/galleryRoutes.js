const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");

router.get("/", galleryController.getGallery);
router.post("/", galleryController.addImage);
router.put("/:id", galleryController.updateImage);
router.delete("/:id", galleryController.deleteImage);

module.exports = router;
