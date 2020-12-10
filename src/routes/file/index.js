var express = require("express");
const passport = require("passport");

var FileRouter = express.Router();
const uploadController = require("../../controllers/upload");

const { getImage } = require("./getImage");
const { getAudio } = require("./getAudio");

FileRouter.route("/upload").post(
  passport.authenticate("jwt", { session: false }),
  uploadController.uploadFile
);
FileRouter.route("/image/:file").get(getImage);
FileRouter.route("/audio/:file").get(getAudio);

module.exports = FileRouter;
