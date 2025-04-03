import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Comment } from "../models/comments.model";
import { Blog } from "../models/blog.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const postComment = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const { blogId } = req.params;

  if (!content) {
    throw new Error("Content is required");
  }

  if (!blogId) {
    throw new ApiError(404, "invalid blog");
  }

  const Createcomment = await Comment.create({
    content,
    blog: blogId,
    owner: req.user?._id,
  });

  if (!Createcomment) {
    throw new ApiError(500, "Failed to create comment");
  }

  const comments = await Comment.findById(Createcomment._id).populate("owner");

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { comments: Createcomment._id },
    },
    { new: true }
  );

  if (!blog) {
    throw new ApiError(500, "Failed to find blog");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, comments, "comment post successfully"));
});

export const getAllComments = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
      throw new ApiError(404, "could not find blog");
    }

    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .populate("owner");

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "comments fetch successfully"));
  }
);

export const editComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId) {
    throw new ApiError(404, "Comment not found");
  }

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  const commentOwner = await Comment.findOne({ _id: commentId }).select(
    "owner"
  );

  if (commentOwner?.owner !== req.user?._id) {
    throw new ApiError(401, "you are not authorized to edit this comment");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(500, "imternal error: comment could not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!commentId) {
      throw new ApiError(404, "comment id not found");
    }

    const commentOwner = await Comment.findOne({ _id: commentId }).select(
      "owner"
    );

    if (commentOwner?.owner !== req.user?._id) {
      throw new ApiError(401, "you are not authorized to edit this comment");
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      throw new ApiError(500, "internal error");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "comment deleted successfully"));
  }
);
