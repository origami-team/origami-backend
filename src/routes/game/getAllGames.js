const express = require("express");
const mongoose = require("mongoose");

const Game = require("../../models/game");

const getAllGames = async (req, res) => {
  try {
    if ("minimal" in req.query) {
      let result = await Game.find().select("name").select("place").select("isVRWorld");
      return res.status(200).send({
        message: "Games (minimal) found successfully.",
        content: result,
      });
    } else {
      let result = await Game.find().select("-user");
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
