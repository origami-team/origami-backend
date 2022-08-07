var express = require("express");

var AppversionRouter = express.Router();

const appVersion = require("../../models/appversion");

AppversionRouter.route("/current").get( async (req, res) => {
  try {
    let result = await appVersion.find();
    console.log(result[0]);
    return res.status(200).send({
      message: "Current App version retreived successfully.",
      content: result[0], // retrun first object which contains the version info
    });

  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = AppversionRouter;
