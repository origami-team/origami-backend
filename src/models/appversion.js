// Define schema
const mongoose = require("mongoose");

const AppVersionSchema = new mongoose.Schema(
  {
    current: {
      type: String,
    },
    build: {
      type: String,
    },
    enabled: Boolean
  }
);

module.exports = mongoose.model("appversion", AppVersionSchema);
