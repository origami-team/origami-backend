var express = require("express");
const passport = require("passport");

const AuthController = require("../../controllers/authController");

const GameRouter = express.Router();

const { getGame } = require("./getGame");
const { getAllGames } = require("./getAllGames");
const { getAllMultiplayerGames } = require("./getAllMultiplayerGames");
const { getAllGamesWithLocs } = require("./getAllGamesWithLocs");
//* Used in evaluate page
const { getUserGames } = require("./getUserGames");
const { postGame } = require("./postGame");
const { putGame } = require("./putGame");
const {deleteGame} = require("./deleteGame")

GameRouter.route("/all").get(getAllGames);
GameRouter.route("/allmultiplayer").get(getAllMultiplayerGames);
GameRouter.route("/allwithlocs").get(getAllGamesWithLocs);
//* Used in evaluate page
GameRouter.route("/usergames").get(
  passport.authenticate("jwt", { session: false }),
  AuthController.roleAuthorization([
    "admin",
    "contentAdmin",
    "trackAccess",
    "scholar",
  ]),
  getUserGames
);
// Get game by id
GameRouter.route("/:id").get(getGame);
// Create new game
GameRouter.route("/").post(
  passport.authenticate("jwt", { session: false }),
  postGame
);
// Update game
GameRouter.route("/").put(
  passport.authenticate("jwt", { session: false }),
  putGame
);
// Delete game
GameRouter.route("/delete/:id").put(
  passport.authenticate("jwt", { session: false }),
  deleteGame
);

module.exports = GameRouter;
