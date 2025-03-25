import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const userRegister = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, nickname, sub, picture, accessToken }: { name: string, email: string, nickname: string, sub: String, picture: string, accessToken: string } = req.body;
    console.log(accessToken);
    if (!name || !email || !nickname || !sub) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
        return res.status(200).json(new ApiResponse(200, user, "Login success"));
    }

    const createUser = await User.create({
        name,
        email,
        nickname,
        sub,
        picture,
        accessToken
    });

    if (!createUser) {
        throw new ApiError(500, "Failed to register user");
    }

    return res.status(201).cookie("accessToken", accessToken).json(new ApiResponse(201, createUser, "user created successfully"));
});