const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    venue: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
