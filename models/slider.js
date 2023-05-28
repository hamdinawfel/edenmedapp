var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var colorSchema = new Schema({
  r: {
    type: Number,
  },
  g: {
    type: Number,
  },
  b: {
    type: Number,
  },
  a: {
    type: Number,
  },
});

var Slider = new Schema({
  imageUrl: {
    type: String,
  },
  backgroundColor: colorSchema,
  title: {
    type: String,
  },
  titleSize: {
    type: Number,
  },
  titleColor: colorSchema,
  subTitle: {
    type: String,
  },
  subTitleSize: {
    type: Number,
  },
  subTitleColor: colorSchema,
  slideAutoplayDelay: {
    type: Number,
    default: 2500,
  },
  language: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Slider', Slider);
