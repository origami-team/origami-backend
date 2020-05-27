// Define schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trackSchema = new Schema({
  game: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  start: {
    type: Date
  },
  end: {
    type: Date
  },
  device: {
    type: Schema.Types.Mixed
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
  players: {
    type: Array
  },
  playersCount: {
    type: Number
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
    name: params.name,
    start: params.start,
    end: params.end,
    device: params.device,
    waypoints: params.waypoints,
    events: params.events,
    answers: params.answers,
    players: params.players,
    playersCount: params.playersCount
  });
};

module.exports = trackSchema;
