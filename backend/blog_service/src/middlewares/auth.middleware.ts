import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { subscribeToQueue } from "../service/rabbit";
import mongoose from "mongoose";

interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "user" | "admin";
  isBlocked: boolean;
  source: "local" | "google";
  following?: Array<string>;
  followers?: Array<string>;
  accessToken?: string;
  refreshToken?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}


export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string | undefined =
      req.cookies?.accessToken ??
      (req.headers?.["authorization"]
        ? req.headers["authorization"].replace("Bearer ", "")
        : undefined);
    if (!token) {
      throw new ApiError(401, "unauthorized");
    }

    const decoded: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.SECRET!
    );

    if (!decoded || typeof decoded === "string" || !("id" in decoded)) {
      throw new ApiError(401, "unauthorized");
    }

    subscribeToQueue("user", (data) => {
      if (!data) {
        throw new ApiError(401, "unauthorized");
      }

      const user: IUser = JSON.parse(data);

      if (user._id.toString() !== decoded.id) {
        throw new ApiError(401, "unauthorized");
      }

      req.user = user;
      console.log("User from queue", user);
    });
    next();
  } catch (error) {
    console.error("Failed to verify JWT", error);
    throw new ApiError(401, "unauthorized");
  }
};
