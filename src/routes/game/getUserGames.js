//* This router will retreive user games that has at least one track
//* It'll be mainly used in evaluate page

const Track = require("../../models/track");
const Game = require("../../models/game");

const getUserGames = async (req, res) => {
  try {
    //* 1. Get user id
    let user = req.user;

    //* 2. Get user games
    let userGames = await Game.find({ user: user._id })
      .select("_id")
      .select("name");

    //*3.  filter games that has tracks and add tracksCount property
    let gamesWithTracks = [];
    // the Execution will not go forward until all the promises are resolved.
    await Promise.all(
      // Add tracksCount property
      userGames.map(async (game) => {
        let gameTracks = await Track.find({ game: game._id });
        let tracksCount = gameTracks.length;
        if (tracksCount > 0) {
          gamesWithTracks.push({ game, tracksCount: tracksCount });
        }
      })
    );

    return res.status(200).send({
      message: "Tracks found successfully.",
      content: gamesWithTracks,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getUserGames,
};
