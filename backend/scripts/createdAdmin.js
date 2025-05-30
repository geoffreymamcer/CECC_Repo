require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const createAdmin = async () => {
  try {
    const admin = await Admin.create({
      email: "akosimark@gmail.com",
      password: "09613457068",
    });
    console.log("Admin created successfully:", admin);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
  mongoose.connection.close();
};

createAdmin();
