// beaconinfo.js
const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const beaconinfoSchema = new Schema({
    major: {
        type: Number,
        required: true
    },
    minor: {
        type: Number,
        required: true
    },
    lng: {
        type: Number
    },
    lat: {
        type: Number
    },
    distanceMeter: {
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

const Beaconinfo = mongoose.model("beaconinfo", beaconinfoSchema);

module.exports = Beaconinfo;