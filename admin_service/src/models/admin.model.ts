import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ["local", "google"],
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET!, { expiresIn: "1d" });
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET!, { expiresIn: "7d" });
};

export interface IAdmin extends mongoose.Document {
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
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
