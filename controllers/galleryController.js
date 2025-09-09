const Gallery = require("../models/Gallery");

// Get all images
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ data: images });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gallery images." });
  }
};

// Add image
exports.addImage = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    if (!title || !imageUrl)
      return res.status(400).json({ message: "Title and Image URL are required." });

    const image = new Gallery({ title, description, imageUrl });
    await image.save();
    res.status(201).json({ data: image });
  } catch (err) {
    res.status(500).json({ message: "Failed to add image." });
  }
};

// Update image
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Gallery.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Image not found." });
    res.status(200).json({ data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update image." });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Gallery.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Image not found." });
    res.status(200).json({ message: "Image deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete image." });
  }
};
