import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { GoogleAuth, OAuth2Client } from "google-auth-library";
import mongoose, { ObjectId } from "mongoose";

interface userTypes {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    source: string;
    accessToken: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

const generateAccessAndRefreshToken = async (userId: ObjectId) => {

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const user = await User.findById(userId);
    console.log(user)

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    return { accessToken, refreshToken };
};


export const userRegister = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, avatar }: userTypes = req.body;

    if (!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.create({ firstName, lastName, email, password, avatar, source: "local" });
    if (!user) {
        throw new ApiError(500, "Failed to register user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id as unknown as mongoose.Schema.Types.ObjectId);

    return res.status(201).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(201, user, "User registered successfully"));
});

export const googleUser = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        throw new ApiError(400, "Token is required");
    }

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID!,
    });

    if (!ticket) {
        throw new ApiError(400, "Invalid token");
    }

    const payload = ticket?.getPayload();

    if (!payload) {
        throw new ApiError(400, "Invalid token payload");
    }
    console.log("User info:", payload);

    const { email, given_name, family_name, picture } = payload;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser._id as unknown as mongoose.Schema.Types.ObjectId);
        return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(200, existedUser, "User login successfully"));
    }

    const user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        password: "",
        avatar: picture,
        source: "google",
        accessToken: token,
    })

    if (!user) {
        throw new ApiError(500, "Failed to register user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id as unknown as mongoose.Schema.Types.ObjectId);


    return res.status(201).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(201, user, "User registered successfully"));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, user, "User found successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id as unknown as mongoose.Schema.Types.ObjectId);

    return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(200, user, "User login successfully"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate({ _id: req.user?._id }, { refreshToken: "" }, { new: true });

    if (!user) {
        throw new ApiError(500, "Failed to logout user");
    }

    return res.clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, null, "User logged out successfully"));
});

export const updateDetails = asyncHandler(async(req: Request, res: Response) => {
    const { firstName, lastName, email, avatar } = req.body;

    const user = await User.findOneAndUpdate({ _id: req.user?._id }, { firstName, lastName, email, avatar }, { new: true });

    if (!user) {
        throw new ApiError(500, "Failed to update user details");
    }

    return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
});

export const updatePassword = asyncHandler(async(req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ _id: req.user?._id });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Password updated successfully"));
});

export const setPassword = asyncHandler(async(req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ _id: req.user?._id });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (password!== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    user.password = confirmPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Password updated successfully"));
});