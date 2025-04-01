import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Blog } from "../models/blog.model";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadImage } from "../utils/Cloudinary";
import mongoose from "mongoose";


export const blogPost = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, content }: { title: string, description: string, content: string } = req.body;

    if (!title || !description || !content) {
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

    if (!coverImagePath) {
        throw new ApiError(400, "Cover image is required");
    }

    const coverImage = await uploadImage(coverImagePath);

    if (!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    const blog = await Blog.create({
        title,
        description,
        content,
        author: req.user?._id,
        coverImage
    })

    if (!blog) {
        throw new ApiError(500, "Failed to create blog");
    }

    return res.status(201).json(new ApiResponse(200, blog, "blog create successfully"));
});

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {

    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author");

    return res.status(200).json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

export const myBlogs = asyncHandler(async (req: Request, res: Response) => {

    const blogs = await Blog.find({ author: req.user?._id }).sort({ createdAt: -1 });

    if (blogs.length < 1) {
        return res.status(200).json(new ApiResponse(404, "Blog not found"));
    }

    const likedBlogs = blogs.map(blog => {
        return blog.likes;
    });

    const views = blogs.map(blog => {
        return blog.views;
    });

    const totalLikes = likedBlogs.reduce((acc, like) => acc + like, 0);
    const totalViews = views.reduce((acc, view) => acc + view, 0);

    return res.status(200).json(new ApiResponse(200, {blogs, totalLikes, totalViews}, "Blogs fetched successfully"));
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, content }: { title: string, description: string, content: string } = req.body;
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog id is required");
    };

    if (!req.files || !('coverImage' in req.files)) {
        throw new ApiError(400, "Cover image is required");
    }

    const files = req.files as { [key: string]: { path: string }[] };
    if (!files.coverImage || !Array.isArray(files.coverImage) || files.coverImage.length === 0) {
        throw new ApiError(400, "Cover image is required");
    }
    const coverImagePath = files.coverImage[0].path;

    if (!coverImagePath) {
        throw new ApiError(400, "Cover image is required");
    }

    const coverImage = await uploadImage(coverImagePath);

    if (!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    const blog = await Blog.findByIdAndUpdate(blogId, {
        title,
        description,
        content,
        coverImage
    }, { new: true });

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog id is required");
    }

    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res.status(200).json(new ApiResponse(200, blog, "Blog deleted successfully"));
});

export const toogleLikedBlog = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog id is required");
    }

    const alreadyLiked = await Blog.findOne({ _id: blogId }, { likedBy: true });
    const likedBy = alreadyLiked?.likedBy;

    if (likedBy?.includes(req.user?._id as mongoose.Types.ObjectId)) {
        await Blog.findByIdAndUpdate(blogId, {
            $pull: { likedBy: req.user?._id }

        }, { new: true });
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likedBy: req.user?._id }

        }, { new: true });

        if (!blog) {
            throw new ApiError(404, "Blog not found");
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "Toggled like successfully"));
});

export const getLikes = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog id is required");
    }

    const blog = await Blog.findById(blogId).populate("likedBy");
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const likes = blog.likedBy.length;

    await Blog.findOneAndUpdate({ _id: blog.id }, { likes }, { new: true });

    return res.status(200).json(new ApiResponse(200, likes, "Likes fetched successfully"));
});

export const blogSeenBy = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog id is required");
    }

    await Blog.findByIdAndUpdate(blogId, {
        $push: { seenBy: req.user?._id }
    }, {new: true });

    return res.status(200).json(new ApiResponse(200, {}, "one view added successfully"));
});

export const getViews = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog id is required");
    }

    const blog = await Blog.findById(blogId).populate("seenBy");
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const views = blog.seenBy.length;

    await Blog.findOneAndUpdate({ _id: blog.id }, { views }, { new: true });

    return res.status(200).json(new ApiResponse(200, views, "views fetched successfully"));
});