import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Admin } from "../models/admin.model";
import { publishToQueue, subscribeToQueue } from "../service/rabbit";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    let totalUsers = 0;
    let totalBlogs = 0;
    let recentBlogs: Array<{ title: string; description: string; createdAt: string; views: number; likes: number; author: { firstName: string; lastName: string; email: string } }> = [];
    interface RecentUser {
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
    }

    let recentUsers: RecentUser[] = [];
    let totalComments = 0;


    subscribeToQueue("userCount", (data) => {
      totalUsers = JSON.parse(data);
    });

    subscribeToQueue("blogCount", (data) => {
      totalBlogs = JSON.parse(data);
    })

    subscribeToQueue("totalComments", (data) => {
      totalComments = JSON.parse(data);
    })

    subscribeToQueue("recentBlogs", (data) => {
      recentBlogs = JSON.parse(data);
    });

    subscribeToQueue("recentUsers", (data) => {
      recentUsers = JSON.parse(data);
    })

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
