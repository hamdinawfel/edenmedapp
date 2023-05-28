const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const speakerSchema = new Schema({
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
});

const sponsorSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const scheduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    invitation: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    sponsors: {
      type: [sponsorSchema],
    },
    speakers: {
      type: [speakerSchema],
    },
    addressGovernorate: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressImage: {
      type: String,
      required: true,
    },
    schedule: {
      type: [scheduleSchema],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    session: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('event', eventSchema);
