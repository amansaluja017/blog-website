import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Admin } from "../models/admin.model";
import { publishToQueue, subscribeToQueue } from "../service/rabbit";

let users: Array<object> = [];

export const loginAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;

    await admin.save();

    return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(200, admin, "Login successful"));
  }
)

subscribeToQueue("checkAdmin", async (data) => {
  const parsedData = JSON.parse(data);
  console.log(parsedData);

  const admin = await Admin.findOne({
    _id: parsedData,
  });
  if (!admin) {
    throw new ApiError(401, "unauthorized");
  }

  publishToQueue("adminVerified", JSON.stringify(admin));
});

export const getAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await Admin.findById(req.user?._id).select("-password -refreshToken");

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    return res.status(200).json(new ApiResponse(200, admin, "Admin fetched successfully"));
  }
)

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
  const interval = setInterval(() => {
    if (users.length > 0) {
      clearInterval(interval);
      return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
    }
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

subscribeToQueue("allUsers", (data) => {
  users = JSON.parse(data);
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  publishToQueue("deleteUser", JSON.stringify(userId));

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

    publishToQueue("blockUser", JSON.stringify(userId));

    // return res
    //   .status(200)
    //   .json(
    //     new ApiResponse(
    //       200,
    //       user,
    //       `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`
    //     )
    //   );
  }
);
