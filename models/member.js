const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("member", memberSchema);
