import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Admin } from "../models/admin.model";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const totalUsers = await Admin.countDocuments({ role: "user" });
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();

    const recentUsers = await Admin.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email avatar createdAt");

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "firstName lastName email")
      .select("title description createdAt views likes");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          stats: { totalUsers, totalBlogs, totalComments },
          recentUsers,
          recentBlogs,
        },
        "Dashboard stats fetched successfully"
      )
    );
  }
);

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select(
    "firstName lastName email avatar createdAt email_verified"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(403, "Cannot delete admin user");
  }

  // Delete user's blogs
  await Blog.deleteMany({ author: userId });
  // Delete user's comments
  await Comment.deleteMany({ owner: userId });
  // Delete user
  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "User and associated data deleted successfully"
      )
    );
});

export const toggleUserBlock = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role === "admin") {
      throw new ApiError(403, "Cannot block admin user");
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`
        )
      );
  }
);
