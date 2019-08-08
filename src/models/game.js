// Define schema
const mongoose = require('mongoose')

const waypoint = require('./waypoint')

const Schema = mongoose.Schema;

const gameSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    author: String,
    timeLimit: {
        type: Number,
        min: 0, max: 300
    },
    waypoints: [waypoint],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

gameSchema.initNew = function (params) {
    // create game document and persist in database
    const Game = mongoose.model('Game', gameSchema);

    return Game.create({
        name: params.name,
        type: params.type,
        description: params.description,
        timecompl: params.timecompl,
        difficulty: params.difficulty,
        private: params.private,
        waypoints: params.waypoints
    });
};

module.exports = gameSchema;