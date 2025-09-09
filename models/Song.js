// const mongoose = require("mongoose");

// const SongSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   views: { type: String },
//   duration: { type: String },
//   lang: { type: String },
//   thumbnail: { type: String },
//   link: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Song", SongSchema);


const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String },
    lang: { type: String },
    thumbnail: { type: String }, // auto generated
    link: { type: String, required: true }, // full YouTube URL
    videoId: { type: String }, // extracted automatically
  },
  { timestamps: true }
);

// Helper: extract videoId from YouTube URL
function extractVideoId(url) {
  try {
    const parsedUrl = new URL(url);

    // For youtu.be short links
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    // For youtube.com/watch?v=...
    if (parsedUrl.searchParams.get("v")) {
      return parsedUrl.searchParams.get("v");
    }

    // For youtube.com/embed/...
    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1];
    }

    return null;
  } catch (err) {
    return null;
  }
}

// Middleware: auto-fill videoId + thumbnail
SongSchema.pre("save", function (next) {
  if (this.link && !this.videoId) {
    const id = extractVideoId(this.link);
    if (id) {
      this.videoId = id;
      if (!this.thumbnail) {
        this.thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
    }
  }
  next();
});

module.exports = mongoose.model("Song", SongSchema);
