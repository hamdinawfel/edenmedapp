const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testimonialSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
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

module.exports = mongoose.model("Testimonial", testimonialSchema);
