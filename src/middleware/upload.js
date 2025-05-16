const util = require("util");
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const mongoHost = process.env.MONGO_HOST;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;

const mongoDB = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/origami`;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

let uploader;

connection.once("open", () => {
  uploader = new GridFSBucket(connection.db, {
    bucketName: "uploads",
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

function writeFileToGridFS(bucket, filename, contentType, metadata, buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata,
    });

    uploadStream.end(buffer);

    uploadStream.on("error", (error) => reject(error));
    uploadStream.on("finish", (file) => resolve(file));
  });
}

const uploadFilesMiddleware = async (req, res, next) => {
  try {
    await util.promisify(upload)(req, res);

    const file = req.file;
    if (!file || !file.buffer) {
      throw new Error("No file uploaded or buffer missing.");
    }

    const photoMatch = ["image/png", "image/jpeg"];
    const audioMatch = ["audio/aac", "audio/mpeg"];
    const videoMatch = ["video/mp4", "video/quicktime"];

    let bucketName = "misc";
    if (photoMatch.includes(file.mimetype)) bucketName = "photos";
    else if (audioMatch.includes(file.mimetype)) bucketName = "audios";
    else if (videoMatch.includes(file.mimetype)) bucketName = "videos";

    const filename = `${Date.now()}-origami-${file.originalname}`;

    const savedFile = await writeFileToGridFS(
      uploader,
      filename,
      file.mimetype,
      { bucket: bucketName },
      file.buffer
    );

    req.savedFile = savedFile;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = (req, res) =>
  new Promise((resolve, reject) => {
    uploadFilesMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve(req.savedFile);
    });
  });
