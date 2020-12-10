const express = require("express");
const mongoose = require("mongoose");

const getAudio = async (req, res) => {
  try {
    const gridfsbucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "audios",
      }
    );

    await gridfsbucket.find({ filename: req.params.file }).hasNext();

    gridfsbucket
      .openDownloadStreamByName(req.params.file)
      .on("error", (err) => res.status(404).json(err))
      .pipe(res);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getAudio,
};
