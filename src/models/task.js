"use strict";

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    answer: {
      type: mongoose.Schema.Types.Mixed,
    },
    category: {
      type: String,
    },
    evaluate: {
      type: String,
    },
    mapFeatures: {
      type: mongoose.Schema.Types.Mixed,
    },
    name: {
      type: String,
    },
    question: {
      type: mongoose.Schema.Types.Mixed,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
    },
    type: {
      type: String,
    }, 
    CollaborationType: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = {
  TaskSchema: TaskSchema,
  Task: mongoose.model("Task", TaskSchema),
};
