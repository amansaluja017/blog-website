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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});
const uploadImage = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!localFilePath)
        return null;
    try {
        const upload = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resourceType: "image",
        });
        fs_1.default.unlinkSync(localFilePath);
        return upload.secure_url;
    }
    catch (error) {
        fs_1.default.unlinkSync(localFilePath);
        console.error("failed to upload", error);
    }
});
exports.uploadImage = uploadImage;
const deleteImage = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!public_id)
        return null;
    try {
        yield cloudinary_1.v2.uploader.destroy(public_id);
    }
    catch (error) {
        console.error("failed to delete", error);
    }
});
exports.deleteImage = deleteImage;
