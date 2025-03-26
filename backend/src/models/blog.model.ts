import mongoose from "mongoose";

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
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        
    }, {timestamps: true}
);

export const Blog = mongoose.model("Blog", blogSchema);