import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String,
        },
        source: {
            type: String,
        }
    }, { timestamps: true }
);

export const User = mongoose.model('User', userSchema);