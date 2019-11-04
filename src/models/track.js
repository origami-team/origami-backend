// Define schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trackSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  waypoints: {
    type: Array
  },
  events: {
    type: Array
  },
  answers: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
trackSchema.initNew = function(params) {
  // create game document and persist in database
  const Track = mongoose.model("Track", trackSchema);

  return Track.create({
    id: params.id,
    game: params.game,
    waypoints: params.waypoints,
    events: params.events,
    answers: params.answers
  });
};

module.exports = gameSchema;
