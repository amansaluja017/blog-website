import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const userRegister = asyncHandler(async(req: Request, res: Response) => {
    const { fullName, email, nickname, source } = req.body;

    if(!fullName || !email || !nickname || !source) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if(user) {
        throw new ApiError(400, "Email already exists");
    }

    const createUser = await User.create({
        fullName,
        email,
        nickname,
        source
    });

    if(!createUser) {
        throw new ApiError(500, "Failed to register user");
    }

    res.status(201).json(new ApiResponse(201, createUser, "user created successfully"));
});