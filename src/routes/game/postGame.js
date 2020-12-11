const express = require("express");
const mongoose = require("mongoose");

const Game = require("../../models/game");

const postGame = async (req, res) => {
  try {
    const game = new Game({ ...req.body, user: req.user._id });
    const savedGame = await game.save();
    return res.status(201).send({
      message: "Game is successfully created.",
      content: savedGame,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

module.exports = {
  postGame,
};
