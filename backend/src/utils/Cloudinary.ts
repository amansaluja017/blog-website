import { v2 as Cloudinary } from "cloudinary";
import fs from "fs";

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});

export const uploadImage = async (localFilePath: string) => {
  if (!localFilePath) return null;

  try {
    const upload = await Cloudinary.uploader.upload(localFilePath, {
      resourceType: "image",
    });
    fs.unlinkSync(localFilePath);
    return upload.secure_url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("failed to upload", error);
  }
};

export const deleteImage = async (public_id: string) => {
  if (!public_id) return null;

  try {
    await Cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("failed to delete", error);
  }
};
