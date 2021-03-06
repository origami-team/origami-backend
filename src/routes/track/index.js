const express = require("express");
const passport = require("passport");

var AuthController = require("../../controllers/authController");

const TrackRouter = express.Router();

const { getTrack } = require("./getTrack");
const { getAllTracks } = require("./getAllTracks");
const { postTrack } = require("./postTrack");

TrackRouter.route("/all").get(
  passport.authenticate("jwt", { session: false }),
  AuthController.roleAuthorization(["admin", "trackAccess"]),
  getAllTracks
);
TrackRouter.route("/:id").get(
  passport.authenticate("jwt", { session: false }),
  AuthController.roleAuthorization(["admin", "trackAccess"]),
  getTrack
);
TrackRouter.route("/").post(postTrack);

module.exports = TrackRouter;
