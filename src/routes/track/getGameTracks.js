const Track = require("../../models/track");

const Game = require("../../models/game");

const getGameTracksById = async (req, res) => {
  try {
    let gameId = req.params.id;
    let gameTracks = await Track.find({ game: gameId }).select("_id").select("players").select("start").select("createdAt");

    return res.status(200).send({
      message: "Tracks found successfully.",
      content: gameTracks,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getGameTracksById,
};
