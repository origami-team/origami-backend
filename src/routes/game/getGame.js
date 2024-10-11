const Game = require("../../models/game");

const getGame = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await Game.findOne({
      $and: [
        {
          $or: [
            { isVisible: { $eq: true } },
            { isVisible: { $exists: false } },
          ],
        },
        { _id: id },
      ],
    }).select("-user");

    // console.log("🚀 ~ getGame ~ result:", result);

    // if game was delete (isVisible=false)
    if (result == null) {
      return res.status(404).send({
        message: "Game was not found.",
        content: result,
      });
    }

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
