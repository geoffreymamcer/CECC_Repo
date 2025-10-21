import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully to MongoDB");

    // Generate a custom ID for the admin
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `CECC${currentYear}-`;

    // Find the highest existing number for this year
    const highestUser = await User.findOne(
      { _id: new RegExp(`^${prefix}`) },
      { _id: 1 },
      { sort: { _id: -1 } }
    );

    let nextNumber = 1;
    if (highestUser && highestUser._id) {
      const currentNumber = parseInt(highestUser._id.split("-")[1]);
      nextNumber = currentNumber + 1;
    }

    // Create the new ID with padding (e.g., CECC23-0001)
    const paddedNumber = nextNumber.toString().padStart(4, "0");
    const newId = `${prefix}${paddedNumber}`;

    const adminData = {
      _id: newId,
      firstName: "CECC",
      lastName: "Owner",
      phone_number: "09876543210",
      email: "owner@cecc.com",
      password: await bcrypt.hash("owner123", 10),
      role: "owner",
    };

    // Check for existing admin by email or phone
    const existingAdmin = await User.findOne({
      $or: [
        { email: adminData.email },
        { phone_number: adminData.phone_number },
      ],
    });

    if (existingAdmin) {
      if (existingAdmin.email === adminData.email) {
        console.log("Admin account with this email already exists");
      }
      if (existingAdmin.phone_number === adminData.phone_number) {
        console.log("Admin account with this phone number already exists");
      }
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
