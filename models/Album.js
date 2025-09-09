// const mongoose = require("mongoose");

// const AlbumSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, "Album title is required"],
//     trim: true
//   },
//   description: {
//     type: String,
//     required: [true, "Album description is required"],
//     trim: true
//   },
//   duration: {
//     type: String,
//     required: [true, "Album duration is required"]
//   },
//   price: {
//     type: Number,
//     required: [true, "Album price is required"],
//     min: [0, "Price cannot be negative"]
//   },
//   image: {
//     type: String,
//     required: [true, "Album image is required"]
//   },
//   driveFileId: {
//     type: String,
//     required: [true, "Google Drive file ID is required"]
//   }
// }, {
//   timestamps: true
// });

// // Index for better performance
// AlbumSchema.index({ title: 1 });

// module.exports = mongoose.model("Album", AlbumSchema);




// backend/models/Album.js
const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Album title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Album description is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Album duration is required"],
    },
    price: {
      type: Number,
      required: [true, "Album price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String, // Cloudinary URL
      required: [true, "Album image is required"],
    },
  },
  { timestamps: true }
);

AlbumSchema.index({ title: 1 });

module.exports = mongoose.model("Album", AlbumSchema);
