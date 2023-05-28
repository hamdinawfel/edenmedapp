const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const faqSchema = new Schema(
  {
    question: {
        type: String,
        required: true,
    },
    response: {
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

module.exports = mongoose.model("faq", faqSchema);
