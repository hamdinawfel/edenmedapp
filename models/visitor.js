const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitorSchema = new Schema(
  {
    visitors: {
        type: Number,
        default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("visitor", visitorSchema);