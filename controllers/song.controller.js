// const Song = require("../models/Song");

// // Create Song
// const createSong = async (req, res) => {
//   try {
//     const song = await Song.create(req.body);
//     return res.status(201).json({
//       success: true,
//       message: "Song created successfully",
//       data: song
//     });
//   } catch (error) {
//     console.error("Error creating song:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error creating song",
//       error: error.message
//     });
//   }
// };

// // Get All Songs
// const getAllSongs = async (req, res) => {
//   try {
//     const songs = await Song.find().sort({ createdAt: -1 });
//     return res.status(200).json({
//       success: true,
//       message: "Songs fetched successfully",
//       data: songs
//     });
//   } catch (error) {
//     console.error("Error fetching songs:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching songs",
//       error: error.message
//     });
//   }
// };

// // Get Single Song by ID
// const getSongById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const song = await Song.findById(id);
    
//     if (!song) {
//       return res.status(404).json({
//         success: false,
//         message: "Song not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Song fetched successfully",
//       data: song
//     });
//   } catch (error) {
//     console.error("Error fetching song:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching song",
//       error: error.message
//     });
//   }
// };

// // Update Song
// const updateSong = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const song = await Song.findByIdAndUpdate(
//       id, 
//       req.body, 
//       { 
//         new: true,
//         runValidators: true
//       }
//     );
    
//     if (!song) {
//       return res.status(404).json({
//         success: false,
//         message: "Song not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Song updated successfully",
//       data: song
//     });
//   } catch (error) {
//     console.error("Error updating song:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error updating song",
//       error: error.message
//     });
//   }
// };

// // Delete Song
// const deleteSong = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const song = await Song.findByIdAndDelete(id);
    
//     if (!song) {
//       return res.status(404).json({
//         success: false,
//         message: "Song not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Song deleted successfully",
//       data: song
//     });
//   } catch (error) {
//     console.error("Error deleting song:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error deleting song",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   createSong,
//   getAllSongs,
//   getSongById,
//   updateSong,
//   deleteSong
// };





const Song = require("../models/Song");

// Create Song
const createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Song created successfully",
      data: song
    });
  } catch (error) {
    console.error("Error creating song:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating song",
      error: error.message
    });
  }
};

// Get All Songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      count: songs.length,
      data: songs
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching songs",
      error: error.message
    });
  }
};

// Get Latest 3 Songs
const getLatestSongs = async (req, res) => {
  try {
    const songs = await Song.find()
      .sort({ createdAt: -1 })
      .limit(3);
    
    return res.status(200).json({
      success: true,
      message: "Latest 3 songs fetched successfully",
      count: songs.length,
      data: songs
    });
  } catch (error) {
    console.error("Error fetching latest songs:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching latest songs",
      error: error.message
    });
  }
};

// Get Single Song by ID
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song fetched successfully",
      data: song
    });
  } catch (error) {
    console.error("Error fetching song:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching song",
      error: error.message
    });
  }
};

// Update Song
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    
    const song = await Song.findByIdAndUpdate(
      id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song updated successfully",
      data: song
    });
  } catch (error) {
    console.error("Error updating song:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating song",
      error: error.message
    });
  }
};

// Delete Song
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    
    const song = await Song.findByIdAndDelete(id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully",
      data: song
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting song",
      error: error.message
    });
  }
};

module.exports = {
  createSong,
  getAllSongs,
  getLatestSongs, // নতুন function added
  getSongById,
  updateSong,
  deleteSong
};