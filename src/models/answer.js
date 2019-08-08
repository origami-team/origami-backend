'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  txt: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  }
});

module.exports = answerSchema;
