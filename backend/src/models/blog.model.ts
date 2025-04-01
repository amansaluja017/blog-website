import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverImage: {
            type: String,
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User"
        },
        views: {
            type: Number,
            default: 0
        },
        seenBy: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User"
        }
    }, { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);