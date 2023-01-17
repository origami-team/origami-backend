const express = require("express");
const mongoose = require("mongoose");

const Track = require("../../models/track");

const putTrack = async (req, res) => {
  try {
    // 1. Get stored track by sent track id
    let storedTrack = await Track.findOne({ _id: req.body._id });
    let playerNo = req.body.playerNo;

    // 2. Update stored track with sent track data 
    storedTrack.waypoints[playerNo - 1] = req.body.waypoints;
    storedTrack.events[playerNo - 1] = req.body.events;
    storedTrack.players[playerNo - 1] = req.body.players[0];
    storedTrack.device[playerNo - 1] = req.body.device;

    // 3. Update stored track in db
    const updatedTrack = await Track.updateOne(
      { _id: req.body._id },
      storedTrack
    );
    // console.log("Track is successfully updated");
    return res.status(201).send({
      message: "Track is successfully updated.",
      content: updatedTrack,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

module.exports = {
  putTrack,
};