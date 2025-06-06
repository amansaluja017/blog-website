import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model";

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const adminUser = await Admin.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin1@yourblog.com",
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      source: "local",
      email_verified: true,
      avatar: "https://ui-avatars.com/api/?name=Admin+User",
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
