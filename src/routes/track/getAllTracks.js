const express = require("express");
const mongoose = require("mongoose");

const Track = require("../../models/track");

const getAllTracks = async (req, res) => {
  try {
    let result = await Track.find();
    return res.status(200).send({
      message: "Tracks found successfully.",
      content: result,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getAllTracks,
};
