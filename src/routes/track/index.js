const express = require("express");
const passport = require("passport");

var AuthController = require("../../controllers/authController");

const TrackRouter = express.Router();

const { getTrack } = require("./getTrack");
const { getAllTracks } = require("./getAllTracks");
//* Used in evaluate page
const { getGameTracksById } = require("./getGameTracks");
const { postTrack } = require("./postTrack");
const { putTrack } = require("./putTrack");

TrackRouter.route("/all").get(
  passport.authenticate("jwt", { session: false }),
  AuthController.roleAuthorization([
    "admin",
    "contentAdmin",
    "trackAccess",
    "scholar",
  ]),
  getAllTracks
);

//* Used in evaluate page
TrackRouter.route("/gametracks/:id").get(
  passport.authenticate("jwt", { session: false }),
  AuthController.roleAuthorization([
    "admin",
    "contentAdmin",
    "trackAccess",
    "scholar",
  ]),
  getGameTracksById
);

TrackRouter.route("/:id").get(
  passport.authenticate("jwt", { session: false }),
  AuthController.roleAuthorization([
    "admin",
    "contentAdmin",
    "trackAccess",
    "scholar",
  ]),
  getTrack
);

TrackRouter.route("/").post(postTrack);
TrackRouter.route("/").put(putTrack);

module.exports = TrackRouter;
