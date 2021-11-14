const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const mongoHost = process.env.MONGO_HOST;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDB = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/origami`;

var storage = new GridFsStorage({
  url: mongoDB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const photoMatch = ["image/png", "image/jpeg"];
    const audioMatch = ["audio/aac", "audio/mpeg"];
    const videoMatch = ["video/mp4", "video/quicktime"];

    console.log(file);

    if (photoMatch.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: "photos",
        filename: `${Date.now()}-origami-${file.originalname}`,
      };
    }
    if (audioMatch.indexOf(file.mimetype) !== -1) {
      const extension = file.mimetype.includes("aac") ? ".aac" : "";
      return {
        bucketName: "audios",
        filename: `${Date.now()}-origami-${file.originalname}${extension}`,
      };
    }
    if (videoMatch.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: "videos",
        filename: `${Date.now()}-origami-${file.originalname}`,
      };
    }
    const filename = `${Date.now()}-origami-${file.originalname}`;
    return filename;
  },
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
