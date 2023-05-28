const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("photo", photoSchema);
