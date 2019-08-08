// Define schema
const mongoose = require('mongoose')
const taskSchema = require('./task');


const Schema = mongoose.Schema;

const waypointSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        min: -90,
        max: 90,
        required: true
    },
    lng: {
        type: Number,
        min: -180,
        max: 180,
        required: true
    },
    tasks: [taskSchema]
});

// Compile model from schema
// var waypointModel = mongoose.model('Waypoint', waypointSchema);

module.exports = waypointSchema 