// Define schema
const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  game: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  device: {
    type: mongoose.Schema.Types.Mixed,
  },
  waypoints: {
    type: Array,
  },
  events: {
    type: Array,
  },
  answers: {
    type: Array,
  },
  players: {
    type: Array,
  },
  playersCount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Track", TrackSchema);
