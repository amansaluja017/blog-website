import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Blog } from "../models/blog.model";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadImage } from "../utils/Cloudinary";


export const blogPost = asyncHandler(async(req: Request, res: Response) => {
    const {title, description, content, author}: {title: string, description: string, content: string, author: string} = req.body;

    if(!title || !description || !content || !author) {
        throw new ApiError(404, "Invalid title or description");
    }

    if (!req.files || !('coverImage' in req.files)) {
        throw new ApiError(400, "Cover image is required");
    }

    const files = req.files as { [key: string]: { path: string }[] };
    if (!files.coverImage || !Array.isArray(files.coverImage) || files.coverImage.length === 0) {
        throw new ApiError(400, "Cover image is required");
    }
    const coverImagePath = files.coverImage[0].path;

    if(!coverImagePath) {
        throw new ApiError(400, "Cover image is required");
    }

    const coverImage = await uploadImage(coverImagePath);

    if(!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    const blog = await Blog.create({
        title,
        description,
        content,
        author,
        coverImage
    })

    if(!blog) {
        throw new ApiError(500, "Failed to create blog");
    }

    return res.status(201).json(new ApiResponse(200, blog, "blog create successfully"));
});

export const getAllBlogs = asyncHandler(async(req: Request, res: Response) => {

    const blogs = await Blog.find().sort({ createdAt: -1 });

    if(blogs.length < 1) {
        return res.status(404).json(new ApiResponse(404, "Blog not found"));
    }

    return res.status(200).json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

export const myBlogs = asyncHandler(async(req: Request, res: Response) => {
    const {email} = req.params;

    if(!email) {
        throw new ApiError(404, "Please enter a valid email address");
    }
});