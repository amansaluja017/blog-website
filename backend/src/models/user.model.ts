import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
        },
        sub: {
            type: String,
        },
        accessToken: {
            type: String,
            required: true,
        }
    }, { timestamps: true }
);

export const User = mongoose.model('User', userSchema);