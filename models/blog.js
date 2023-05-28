const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tags: {
        type: [String],
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    content: {
      type: [
        {
          subTitle: {
            type: String,
            required: false,
          },
          section: {
            type: String,
            required: false,
          },
          contentImg: {
            type: String,
            required: false,
          }
        }
      ],
      required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    vues: {
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

module.exports = mongoose.model("blog", blogSchema);
