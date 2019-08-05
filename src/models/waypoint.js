// Define schema
const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var waypointSchema = new Schema({
    name: String,
    description: String,
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
});

// Compile model from schema
// var waypointModel = mongoose.model('Waypoint', waypointSchema);

module.exports = waypointSchema 