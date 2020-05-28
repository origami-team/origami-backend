// Define schema
const mongoose = require("mongoose");

const waypoint = require("./waypoint");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  tracking: Boolean,
  bbox: {
    type: Schema.Types.Mixed
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

gameSchema.initNew = function(params) {
  // create game document and persist in database
  const Game = mongoose.model("Game", gameSchema);

  return Game.create({
    name: params.name,
    tasks: params.tasks,
    tracking: params.tracking,
    bbox: params.bbox
  });
};

gameSchema.update = async function(params) {
  // create game document and persist in database
  const Game = mongoose.model("Game", gameSchema);

  const gameToUpdate = await Game.findOne({_id: params._id});

  return gameToUpdate.updateOne({...params, updatedAt: Date.now()})
};

module.exports = gameSchema;
