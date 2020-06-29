const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const mongoHost = process.env.MONGO_HOST
const mongoUsername = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD
const mongoDB = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/origami`;

var storage = new GridFsStorage({
  url: mongoDB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-origami-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-origami-${file.originalname}`
    };
  }
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
