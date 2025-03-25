import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Blog } from "../models/blog.model";
import { ApiResponse } from "../utils/ApiResponse";


export const blogPost = asyncHandler(async(req: Request, res: Response) => {
    const {title, description, content, author}: {title: string, description: string, content: string, author: string} = req.body;

    if(!title || !description || !content || !author) {
        throw new ApiError(404, "Invalid title or description");
    }

    const blog = await Blog.create({
        title,
        description,
        content,
        author
    })

    if(!blog) {
        throw new ApiError(500, "Failed to create blog");
    }

    return res.status(201).json(new ApiResponse(200, blog, "blog create successfully"));
});