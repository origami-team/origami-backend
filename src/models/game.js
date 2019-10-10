// Define schema
const mongoose = require('mongoose')

const waypoint = require('./waypoint')

const Schema = mongoose.Schema;

const gameSchema = new Schema({

    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    tasks: {
        type: Array,
        required: true
    },
    tracking: Boolean,
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
        id: params.id,
        name: params.name,
        tasks: params.tasks,
        tracking: params.tracking,
    });
};

module.exports = gameSchema;