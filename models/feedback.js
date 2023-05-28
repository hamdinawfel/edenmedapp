var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userInformationsSchema = new Schema({
  field: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: false,
  },
});

const answersSchema = new Schema({
  question: {
    //Survey QUESTION BODY
    type: String,
    required: true,
  },
  answer: {
    // THIS FIELD WILL BE ONE THE 3 OPTION QUESTION CHOISES
    type: String,
    required: false,
  },
});

var feedbackSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userInformations: {
    type: [userInformationsSchema],
  },
  answers: {
    type: [answersSchema],
  },
});

module.exports = mongoose.model('feedback', feedbackSchema);
