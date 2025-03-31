import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
        },
        source: {
            type: String,
            enum: ["local", "google"]
        },
        email_verified: {
            type: Boolean,
            default: false
        },
        accessToken: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
    }, { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET!, { expiresIn: "1d" });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET!, { expiresIn: "7d" });
};

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    avatar?: string;
    source: "local" | "google";
    accessToken?: string;
    refreshToken?: string;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
    comparePassword: (password: string) => Promise<boolean>;
}

export const User = mongoose.model<IUser>('User', userSchema);