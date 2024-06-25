const Game = require("../../models/game");
const User = require("../../models/user");

/**
 * Note: The implementation of deleting a game is only hiding it 
 * by updating its visibilty
 */
const deleteGame = async (req, res) => {
  try {
    let id = req.params.id;
    // TODO: check if game is already deleted
    let gameToUpdate = await Game.findOne({ _id: id });
    const userCalling = await User.findOne({ _id: req.user._id });
    const rolesWithGameAccess = ["admin", "contentAdmin"];
    // user is owner of the game or is admin / contentAdmin
    if (
      gameToUpdate.user.equals(userCalling._id) ||
      rolesWithGameAccess.some((role) => userCalling.roles.includes(role))
    ) {
      const updatedGame = await Game.updateOne(
        { _id: id },
        { $set: { isVisible: false } }  // here: it updates game visibility
      );
      return res.status(200).send({
        message: "Game successfully deleted.",
        content: updatedGame,
      });
    } else {
      return res.status(405).send({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

module.exports = {
  deleteGame,
};
