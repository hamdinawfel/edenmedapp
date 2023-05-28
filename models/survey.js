var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const questionsSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  answerOptions: {
    first: {
      type: String,
      required: false,
    },
    second: {
      type: String,
      required: false,
    },
    third: {
      type: String,
      required: false,
    },
  },
});

var Survey = new Schema({
  label: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userInformations: {
    type: [String],
  },
  questions: {
    type: [questionsSchema],
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Survey', Survey);
