import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user with admin role
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      console.log(`Admin login failed: No admin found with email ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      console.log(`Admin login failed: Invalid password for email ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token with role
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`Admin login successful: ${email}`);
    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The user data is already attached to req.user by the auth middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Admin privileges required" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error during token verification" });
  }
};
