import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminData = {
      firstName: "Admin",
      lastName: "User",
      phone_number: "1234567890", // Added required field
      email: "admin@cecc.com",
      password: await bcrypt.hash("admin123", 10), // Hash the password
      role: "admin",
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin account already exists");
      process.exit(0);
    }

    const admin = await User.create(adminData);
    console.log("Admin account created successfully:", admin);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
