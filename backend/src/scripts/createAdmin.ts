import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@yourblog.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@yourblog.com",
      password: hashedPassword,
      role: "admin",
      source: "local",
      email_verified: true,
      avatar: "https://ui-avatars.com/api/?name=Admin+User"
    });

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();