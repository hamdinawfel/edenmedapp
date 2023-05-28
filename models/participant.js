const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    organism: {
        type: String,
        required: true,
    },
    eventId: {
        type: String,
        required: true,
    },
    eventTitle: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    activationCode: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("participant", participantSchema);
