import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { OAuth2Client } from "google-auth-library";
import mongoose, { ObjectId } from "mongoose";
import crypto from "crypto";
import { mailOptions } from "../nodemailer/nodemailerConfig";
import { uploadImage } from "../utils/Cloudinary";
import { publishToQueue, subscribeToQueue } from "../service/rabbit";

interface userTypes {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  source: string;
  accessToken: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

const generateAccessAndRefreshToken = async (userId: ObjectId) => {
  if (!userId) {
    throw new ApiError(400, "User id is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  return { accessToken, refreshToken };
};

const getOtp = (num: number) => {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
};

export const userRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, avatar }: userTypes =
      req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      avatar,
      source: "local",
    });
    if (!user) {
      throw new ApiError(500, "Failed to register user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id as unknown as mongoose.Schema.Types.ObjectId
    );

    const userCount = await User.countDocuments({ role: "user" });

    publishToQueue("userCount", JSON.stringify(userCount));

    return res
      .status(201)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(new ApiResponse(201, user, "User registered successfully"));
  }
);

export const googleUser = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  if (!ticket) {
    throw new ApiError(400, "Invalid token");
  }

  const payload = ticket?.getPayload();

  if (!payload) {
    throw new ApiError(400, "Invalid token payload");
  }

  const { email, given_name, family_name, picture, email_verified } = payload;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existedUser._id as unknown as mongoose.Schema.Types.ObjectId
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(new ApiResponse(200, existedUser, "User login successfully"));
  }

  const user = await User.create({
    firstName: given_name,
    lastName: family_name,
    email,
    password: "",
    avatar: picture,
    source: "google",
    accessToken: token,
    email_verified,
  });

  if (!user) {
    throw new ApiError(500, "Failed to register user");
  }

  const userCount = await User.countDocuments({ role: "user" });

  publishToQueue("userCount", JSON.stringify(userCount));

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id as unknown as mongoose.Schema.Types.ObjectId
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User found successfully"));
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const blokedUser = user.isBlocked;

  if(blokedUser) {
    throw new ApiError(403, "Access denied: because your id is blocked")
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id as unknown as mongoose.Schema.Types.ObjectId
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, user, "User login successfully"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user?._id },
    { refreshToken: "" },
    { new: true }
  );

  if (!user) {
    throw new ApiError(500, "Failed to logout user");
  }

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const updateDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email } = req.body;

    const files = req.files as { [key: string]: { path: string }[] };
    const avatarImagePath = files.avatar ? files.avatar[0].path : null;

    const avatar = await uploadImage(avatarImagePath as string);

    const user = await User.findOneAndUpdate(
      { _id: req.user?._id },
      { firstName, lastName, email, ...(avatar && { avatar }) },
      { new: true }
    );

    if (!user) {
      throw new ApiError(500, "Failed to update user details");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User details updated successfully"));
  }
);

export const updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ _id: req.user?._id });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Password updated successfully"));
  }
);

export const setPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ _id: req.user?._id });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  user.password = confirmPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Password updated successfully"));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const email = user.email;

  const otp = getOtp(6);

  if (!otp) {
    throw new ApiError(500, "internal error: Failed to gernate otp");
  }

  mailOptions(
    process.env.NODEMAILER_USER!,
    email,
    "YourBlogs",
    `your otp for email varification is ${otp}`
  );

  return res.status(200).json(new ApiResponse(200, otp, "success"));
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { otp, value } = req.body;

  if (!otp || !value) {
    throw new ApiError(400, "All fields are required");
  }

  if (otp !== value) {
    throw new ApiError(400, "Invalid otp");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { email_verified: true },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Email verified successfully"));
});

export const checkUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = getOtp(6);

  if (!otp) {
    throw new ApiError(500, "internal error: Failed to generate otp");
  }

  mailOptions(
    process.env.NODEMAILER_USER!,
    email,
    "Forgot Password",
    `your otp for forgot password is ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user, otp }, "User found successfully"));
});

export const createPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, confirmPassword, email } = req.body;

    if (!password || !confirmPassword) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    user.password = confirmPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Password updated successfully"));
  }
);

export const followers = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(404, "userId not found")
  }

  const loginUser = await User.findById(req.user?._id);

  if (!loginUser) {
    throw new ApiError(401, "unauthorized")
  }

  const following = loginUser.following;

  if(following?.includes(userId)) {
    await User.findByIdAndUpdate(req.user?._id, {
      $pull: {following: userId}
    })

    const unfollowUser = await User.findById(userId);

    if (unfollowUser) {
      await User.findByIdAndUpdate(userId, {
        $pull: {followers: req.user?._id}
      }, {new: true})
    } else {
      publishToQueue("unfollowAdmin", JSON.stringify({adminId: userId, userId: req.user?._id}));
    }

    return res.status(200).json(new ApiResponse(200, {}, "unfollow success"))
  } else {
    await User.findByIdAndUpdate(req.user?._id, {
      $push: {following: userId}
    })

    const followUser = await User.findById(userId);

    if(followUser) {
      await User.findByIdAndUpdate(userId, {
        $push: {followers: req.user?._id}
      }, {new: true})
    } else {
      publishToQueue("followAdmin", JSON.stringify({adminId: userId, userId: req.user?._id}));
    }

    return res.status(200).json(new ApiResponse(200, {}, "follow success"))
  }
});

subscribeToQueue("user", async (data) => {
  try {
    const userId = JSON.parse(data);

    const user = await User.findById(userId).select("-password -refreshToken -__v");

    if (!user) {
      throw new ApiError(401, "unauthorized");
    }

    if(user.isBlocked) {
      throw new ApiError(403, "Access denid: user id is blocked")
    }

    publishToQueue("userInfo", JSON.stringify(user));
  } catch (error) {
    console.error("Error processing blog:create message:", error);
  }
});

subscribeToQueue("getUsersBlogs", async (data) => {
  const ids = JSON.parse(data);

  const authors = await User.find({ _id: ids })

  publishToQueue("users", JSON.stringify(authors))
})

subscribeToQueue("unfollowUser", async (data) => {
  const {adminId, userId} = JSON.parse(data);

  await User.findByIdAndUpdate(userId, {
    $pull: {followers: adminId}
  }, {new: true})
});

subscribeToQueue("followUser", async (data) => {
  const {adminId, userId} = JSON.parse(data);

  await User.findByIdAndUpdate(userId, {
    $push: {followers: adminId}
  }, {new: true})
});

subscribeToQueue("totalUsers", async () => {
  const usersCount = await User.countDocuments();

  if (usersCount > 0) {
    publishToQueue("userCount", JSON.stringify(usersCount))
  }
});

subscribeToQueue("getRecentUsers", async () => {
  const recentUsers = await User.find().sort({createdAt: -1}).limit(5);

  publishToQueue("recentUsers", JSON.stringify(recentUsers));
})

subscribeToQueue("getAllUsers", async () => {
  const allUsers = await User.find().sort({createdAt: -1});

  await publishToQueue("allUsers", JSON.stringify(allUsers));
});

subscribeToQueue("deleteUser", async (data) => {
  const userId = JSON.parse(data);

  await User.findByIdAndDelete(userId);
});

subscribeToQueue("blockUser", async(data) => {
  const userId = JSON.parse(data);

  await User.findByIdAndUpdate(userId, {isBlocked: true});
});