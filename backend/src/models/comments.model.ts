import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  { timestamps: true }
);

interface IComment extends mongoose.Document {
  content?: string;
  owner?: mongoose.Schema.Types.ObjectId;
  blog?: mongoose.Schema.Types.ObjectId;
}

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
