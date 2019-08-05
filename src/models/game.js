// Define schema
const mongoose = require('mongoose')

const waypoint = require('./waypoint')

var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: String,
    description: String,
    author: String,
    timeLimit: { type: Number, min: 0, max: 300 },
    waypoints: [waypoint]
});

module.exports = mongoose.model('Game', gameSchema);