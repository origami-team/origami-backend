var express = require("express");
const passport = require("passport");

var GameRouter = express.Router();

const { getGame } = require("./getGame");
const { getAllGames } = require("./getAllGames");
const { postGame } = require("./postGame");
const { putGame } = require("./putGame");

GameRouter.route("/all").get(getAllGames);
GameRouter.route("/:id").get(getGame);
GameRouter.route("/").post(
  passport.authenticate("jwt", { session: false }),
  postGame
);
GameRouter.route("/").put(
  passport.authenticate("jwt", { session: false }),
  putGame
);

module.exports = GameRouter;
