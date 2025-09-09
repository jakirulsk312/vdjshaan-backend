const Album = require("../models/Album");

// Create Album (Admin only)
const createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      data: album
    });
  } catch (error) {
    console.error("Error creating album:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating album",
      error: error.message
    });
  }
};

// Get All Albums (Public)
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Albums fetched successfully",
      count: albums.length,
      data: albums
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching albums",
      error: error.message
    });
  }
};

// Get Single Album by ID (Public)
const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Album fetched successfully",
      data: album
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching album",
      error: error.message
    });
  }
};

// Update Album (Admin only)
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const album = await Album.findByIdAndUpdate(
      id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: album
    });
  } catch (error) {
    console.error("Error updating album:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating album",
      error: error.message
    });
  }
};

// Delete Album (Admin only)
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const album = await Album.findByIdAndDelete(id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Album deleted successfully",
      data: album
    });
  } catch (error) {
    console.error("Error deleting album:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting album",
      error: error.message
    });
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
};









// // backend/controllers/album.controller.js
// const Album = require("../models/Album");

// // Create Album (Admin only)
// const createAlbum = async (req, res) => {
//   try {
//     const { title, description, duration, price, image } = req.body;

//     if (!title || !description || !duration || !price || !image) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields including image are required",
//       });
//     }

//     const album = await Album.create({ title, description, duration, price, image });

//     return res.status(201).json({
//       success: true,
//       message: "Album created successfully",
//       data: album,
//     });
//   } catch (error) {
//     console.error("Error creating album:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error creating album",
//       error: error.message,
//     });
//   }
// };

// // Other CRUD remain mostly the same but `driveFileId` is gone
