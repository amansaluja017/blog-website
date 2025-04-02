import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
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

    const user: IUser | null = await User.findOne({
      _id: (decoded as DecodedToken).id,
    });

    if (!user) {
      throw new ApiError(401, "unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Failed to verify JWT", error);
    throw new ApiError(401, "unauthorized");
  }
};
