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
exports.userRegister = void 0;
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.userRegister = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, nickname, source } = req.body;
    if (!fullName || !email || !nickname || !source) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    // Check if email already exists
    const user = yield user_model_1.User.findOne({ email });
    if (user) {
        throw new ApiError_1.ApiError(400, "Email already exists");
    }
    const createUser = yield user_model_1.User.create({
        fullName,
        email,
        nickname,
        source
    });
    if (!createUser) {
        throw new ApiError_1.ApiError(500, "Failed to register user");
    }
    res.status(201).json(new ApiResponse_1.ApiResponse(201, createUser, "user created successfully"));
}));
