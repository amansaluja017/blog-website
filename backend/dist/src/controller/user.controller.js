"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.updatePassword = exports.updateDetails = exports.logout = exports.login = exports.getCurrentUser = exports.googleUser = exports.userRegister = void 0;
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.ApiError(400, "User id is required");
    }
    const user = yield user_model_1.User.findById(userId);
    console.log(user);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    return { accessToken, refreshToken };
});
exports.userRegister = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, avatar } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const user = yield user_model_1.User.create({ firstName, lastName, email, password, avatar, source: "local" });
    if (!user) {
        throw new ApiError_1.ApiError(500, "Failed to register user");
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(user._id);
    return res.status(201).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse_1.ApiResponse(201, user, "User registered successfully"));
}));
exports.googleUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        throw new ApiError_1.ApiError(400, "Token is required");
    }
    const ticket = yield client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) {
        throw new ApiError_1.ApiError(400, "Invalid token");
    }
    const payload = ticket === null || ticket === void 0 ? void 0 : ticket.getPayload();
    if (!payload) {
        throw new ApiError_1.ApiError(400, "Invalid token payload");
    }
    console.log("User info:", payload);
    const { email, given_name, family_name, picture } = payload;
    const existedUser = yield user_model_1.User.findOne({ email });
    if (existedUser) {
        const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(existedUser._id);
        return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse_1.ApiResponse(200, existedUser, "User login successfully"));
    }
    const user = yield user_model_1.User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        password: "",
        avatar: picture,
        source: "google",
        accessToken: token,
    });
    if (!user) {
        throw new ApiError_1.ApiError(500, "Failed to register user");
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(user._id);
    return res.status(201).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse_1.ApiResponse(201, user, "User registered successfully"));
}));
exports.getCurrentUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(404).json(new ApiResponse_1.ApiResponse(404, null, "User not found"));
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "User found successfully"));
}));
exports.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError_1.ApiError(400, "Invalid credentials");
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(user._id);
    return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse_1.ApiResponse(200, user, "User login successfully"));
}));
exports.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { refreshToken: "" }, { new: true });
    if (!user) {
        throw new ApiError_1.ApiError(500, "Failed to logout user");
    }
    return res.clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse_1.ApiResponse(200, null, "User logged out successfully"));
}));
exports.updateDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, email, avatar } = req.body;
    const user = yield user_model_1.User.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { firstName, lastName, email, avatar }, { new: true });
    if (!user) {
        throw new ApiError_1.ApiError(500, "Failed to update user details");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "User details updated successfully"));
}));
exports.updatePassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const user = yield user_model_1.User.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const isMatch = yield user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new ApiError_1.ApiError(400, "Invalid credentials");
    }
    user.password = newPassword;
    yield user.save();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "Password updated successfully"));
}));
exports.setPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const user = yield user_model_1.User.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    if (password !== confirmPassword) {
        throw new ApiError_1.ApiError(400, "Passwords do not match");
    }
    user.password = confirmPassword;
    yield user.save();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "Password updated successfully"));
}));
