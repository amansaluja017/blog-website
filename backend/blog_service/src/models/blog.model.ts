import mongoose from "mongoose";

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
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    coverImage: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    views: {
      type: Number,
      default: 0,
    },
    seenBy: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
