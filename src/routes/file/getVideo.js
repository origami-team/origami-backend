const express = require("express");
const mongoose = require("mongoose");

const getVideo = async (req, res) => {
  try {
    const gridfsbucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "videos",
      }
    );

    const videos = await gridfsbucket
      .find({ filename: req.params.file })
      .toArray();

    if (videos.length === 0) {
      throw new Error("no video found");
    }

    const video = videos[0];

    console.log(video);

    // Check for range headers to find our start time
    const range = req.headers.range;

    // Create response headers
    const videoSize = video.length;
    let start = 0;
    const end = videoSize - 1;

    if (range) {
      start = Number(range.replace(/\D/g, ""));
      console.log(range, start);
    }

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": video.contentType,
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // pipe sthe stream
    gridfsbucket
      .openDownloadStreamByName(req.params.file)
      .on("error", (err) => res.status(404).json(err))
      .pipe(res);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getVideo,
};
