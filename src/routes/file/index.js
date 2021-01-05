var express = require("express");
const passport = require("passport");

var FileRouter = express.Router();
const uploadController = require("../../controllers/upload");

const { getImage } = require("./getImage");
const { getAudio } = require("./getAudio");
const { getVideo } = require("./getVideo");

FileRouter.route("/upload").post(uploadController.uploadFile);
FileRouter.route("/image/:file").get(getImage);
FileRouter.route("/audio/:file").get(getAudio);
FileRouter.route("/video/:file").get(getVideo);

module.exports = FileRouter;
