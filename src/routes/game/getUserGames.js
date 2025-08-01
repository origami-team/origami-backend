//* This router will retreive user games that has at least one track
//* It'll be mainly used in evaluate page

const Track = require("../../models/track");
const Game = require("../../models/game");

const getUserGames = async (req, res) => {
  try {
    //* 1. Get user id
    let user = req.user;

    //* 2. Get user games
    let userGames = await Game.find({
      $and: [
        {
          $or: [
            { isVisible: { $eq: true } },
            { isVisible: { $exists: false } },
          ],
        },
        { user: user._id },
      ],
    })
      .select("_id")
      .select("name")
      .select("isVRWorld")
      .select("isMultiplayerGame")
      .select("virEnvType");

    //*3.  filter games that has tracks and add tracksCount property
    let gamesWithTracks = [];
    // the Execution will not go forward until all the promises are resolved.
    await Promise.all(
      // Add tracksCount property
      userGames.map(async (game) => {
        let gameTracks = await Track.find({
          game: game._id,
          createdAt: { $gt: new Date("2022-07-22T00:00:00.000Z") }
        });
        let tracksCount = gameTracks.length;
        if (tracksCount > 0) {
          gamesWithTracks.push({
            _id: game._id,
            name: game.name,
            isVRWorld: game.isVRWorld,
            isMultiplayerGame: game.isMultiplayerGame,
            virEnvType: game.virEnvType,
            tracksCount: tracksCount,
          });
        }
      })
    );

    return res.status(200).send({
      message: "Games found successfully.",
      content: gamesWithTracks,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getUserGames,
};
