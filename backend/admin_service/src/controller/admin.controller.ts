import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Admin } from "../models/admin.model";
import { publishToQueue, subscribeToQueue } from "../service/rabbit";
import { uploadImage } from "../utils/Cloudinary";

interface RecentUser {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface RecentBlog {
  title: string;
  description: string;
  createdAt: string;
  views: number;
  likes: number;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  }
}

let recentBlogs: RecentBlog[] = [];

let users: Array<object> = [];
let totalUsers = 0;
let totalBlogs = 0;
let totalComments = 0;
let recentUsers: RecentUser[] = [];

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

subscribeToQueue("blog:create", async (data) => {
  const parsedData = JSON.parse(data);

  const admin = await Admin.findById(parsedData);

  if (!admin) {
    await publishToQueue("user", data);
  }

  publishToQueue("adminVerified", JSON.stringify(admin));
})

export const getAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await Admin.findById(req.user?._id).select("-password -refreshToken");

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    return res.status(200).json(new ApiResponse(200, admin, "Admin fetched successfully"));
  }
)

export const updateAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email } = req.body;

    const files = req.files as { [key: string]: { path: string }[] };
    const avatarImagePath = files.avatar ? files.avatar[0].path : null;

    const avatar = await uploadImage(avatarImagePath as string);

    const admin = await Admin.findOneAndUpdate(
      { _id: req.user?._id },
      { firstName, lastName, email, ...(avatar && { avatar }) },
      { new: true }
    );

    if (!admin) {
      throw new ApiError(500, "Failed to update user details");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, admin, "admin details updated successfully"));
  }
);

export const updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }

    const admin = await Admin.findOne({ _id: req.user?._id });
    if (!admin) {
      throw new ApiError(404, "admin not found");
    }

    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    admin.password = newPassword;
    await admin.save();

    return res
      .status(200)
      .json(new ApiResponse(200, admin, "Password updated successfully"));
  }
);

export const followers = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(404, "userId not found")
  }

  const loginUser = await Admin.findById(req.user?._id);

  if (!loginUser) {
    throw new ApiError(401, "unauthorized")
  }

  const following = loginUser.following;

  if (following?.includes(userId)) {
    await Admin.findByIdAndUpdate(req.user?._id, {
      $pull: { following: userId }
    })

    const unfollowUser = await Admin.findById(userId);

    if (unfollowUser) {
      await Admin.findByIdAndUpdate(userId, {
        $pull: { followers: req.user?._id }
      }, { new: true })
    } else {
      publishToQueue("unfollowUser", JSON.stringify({ userId: userId, adminId: req.user?._id }));
    }

    return res.status(200).json(new ApiResponse(200, {}, "unfollow success"))
  } else {
    await Admin.findByIdAndUpdate(req.user?._id, {
      $push: { following: userId }
    })

    const followUser = await Admin.findById(userId);

    if (followUser) {
      await Admin.findByIdAndUpdate(userId, {
        $push: { followers: req.user?._id }
      }, { new: true })
    } else {
      publishToQueue("followUser", JSON.stringify({ userId: userId, adminId: req.user?._id }));
    }

    return res.status(200).json(new ApiResponse(200, {}, "follow success"))
  }
});


export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    publishToQueue("totalUsers", "get total users");
    publishToQueue("totalBlogs", "get total blogs");
    publishToQueue("totalComments", "get total comments");
    publishToQueue("getRecentUsers", "get recent users");
    publishToQueue("getRecentBlogs", "get recent blogs");

    setTimeout(() => {
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
    }, 5000);
  }
);

subscribeToQueue("userCount", (data) => {
  const parsedData = JSON.parse(data);

  totalUsers = parsedData;
})

subscribeToQueue("blogCount", (data) => {
  const parsedData = JSON.parse(data);

  totalBlogs = parsedData;
})

subscribeToQueue("commentCount", (data) => {
  const parsedData = JSON.parse(data);

  totalComments = parsedData;
})

subscribeToQueue("recentUsers", (data) => {
  const parsedData = JSON.parse(data);

  recentUsers = parsedData;

})

subscribeToQueue("recentBlogs", (data) => {
  const parsedData = JSON.parse(data);

  recentBlogs = parsedData;
})

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  publishToQueue("getAllUsers", "get all users");

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
  publishToQueue("userBlogsDelete", JSON.stringify(userId));
  publishToQueue("userCommentsDelete", JSON.stringify(userId));

  setTimeout(() => {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "User and associated data deleted successfully"
        )
      );
  }, 1000);
});

export const toggleUserBlock = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    publishToQueue("blockUser", JSON.stringify(userId));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "user blocked successfully"
        )
      );
  }
);

subscribeToQueue("getAdminBlogs", async (data) => {
  const ids = JSON.parse(data);

  const authors = await Admin.find({ _id: ids })

  publishToQueue("admins", JSON.stringify(authors))
})


subscribeToQueue("unfollowAdmin", async (data) => {
  const { adminId, userId } = JSON.parse(data);

  await Admin.findByIdAndUpdate(adminId, {
    $pull: { followers: userId }
  }, { new: true })
});

subscribeToQueue("followAdmin", async (data) => {
  const { adminId, userId } = JSON.parse(data);

  await Admin.findByIdAndUpdate(adminId, {
    $push: { followers: userId }
  }, { new: true })
});