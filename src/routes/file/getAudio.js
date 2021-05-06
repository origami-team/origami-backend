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

    const audios = await gridfsbucket
      .find({ filename: req.params.file })
      .toArray();

    if (audios.length === 0) {
      throw new Error("no audio found");
    }

    const audio = audios[0];

    console.log(audio);

    const headers = {
      "Content-Type": audio.contentType,
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(200, headers);

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
