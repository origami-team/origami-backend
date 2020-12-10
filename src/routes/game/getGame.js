const express = require("express");
const mongoose = require("mongoose");

const Game = require("../../models/game");

const getGame = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await Game.findOne({ _id: id });
    return res.status(200).send({
      message: "Game found successfully.",
      content: result,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getGame,
};
