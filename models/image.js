var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  imageUrl: {
    type: String,
  },
  title: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('image', ImageSchema);
