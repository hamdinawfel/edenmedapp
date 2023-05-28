var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pupup = new Schema({
  imageUrl: {
    type: String,
  },
  label: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Pupup', Pupup);
