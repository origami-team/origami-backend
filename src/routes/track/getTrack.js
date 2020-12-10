const express = require("express");
const mongoose = require("mongoose");

const Track = require("../../models/track");

const getTrack = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await Track.findOne({ _id: id });
    return res.status(200).send({
      message: "Track found successfully.",
      content: result,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getTrack,
};
