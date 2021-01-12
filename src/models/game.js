// Define schema
const mongoose = require("mongoose");

const { TaskSchema } = require("./task");

const GameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    place: {
      type: String,
    },
    tasks: {
      type: [TaskSchema],
      required: true,
    },
    bbox: {
      type: mongoose.Schema.Types.Mixed,
    },
    mapSectionVisible: Boolean,
    geofence: Boolean,
    tracking: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", GameSchema);
