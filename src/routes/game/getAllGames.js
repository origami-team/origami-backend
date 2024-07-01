const express = require("express");
const mongoose = require("mongoose");

const Game = require("../../models/game");

const getAllGames = async (req, res) => {
  try {
    if ("minimal" in req.query) {
      let result;
      // allow only content-admin to get multiplayer games
      if ("contentAdmin" in req.query) {
        // get all games
        result = await Game.find({
          $or: [
            { isVisible: { $eq: true } },
            { isVisible: { $exists: false } },
          ],
        })
          .select("name")
          .select("place")
          .select("user")
          .select("isVRWorld")
          .select("isCuratedGame")
          .select("isMultiplayerGame")
          .select("numPlayers")
          .select("tasksCount");
      } else {
        // Get all games except multiplyer and deleted ones
        result = await Game.find({
          $and: [
            {
              $or: [
                { isVisible: { $eq: true } },
                { isVisible: { $exists: false } },
              ],
            },
            {
              $or: [
                { isMultiplayerGame: { $eq: false } },
                { isMultiplayerGame: { $eq: undefined } },
              ],
            },
          ],
        })
          .select("name")
          .select("place")
          .select("user")
          .select("isVRWorld")
          .select("isCuratedGame")
          .select("tasksCount");
      }

      return res.status(200).send({
        message: "Games (minimal) found successfully.",
        content: result,
      });
    } else {
      // Get games data except user id
      let result = await Game.find({
        $or: [{ isVisible: { $eq: true } }, { isVisible: { $exists: false } }],
      }).select("-user");
      console.log(result);
      return res.status(200).send({
        message: "Games found successfully.",
        content: result,
      });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getAllGames,
};
