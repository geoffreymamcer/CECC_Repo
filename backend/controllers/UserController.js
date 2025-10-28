import User from "../models/User.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../services/emailService.js";

const pendingVerifications = {};

export const signup = async (req, res) => {
  try {
    const { firstName, middleName, lastName, phone_number, email, password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash password before storing it temporarily
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user data and verification code temporarily
    pendingVerifications[email] = {
      firstName,
      middleName,
      lastName,
      phone_number,
      email,
      password: hashedPassword,
      verificationCode,
      expiresAt: Date.now() + 3600000, // 1 hour expiry
    };

    // Send verification email
    await sendVerificationEmail(email, verificationCode, firstName);

    res.status(200).json({
      status: "success",
      message:
        "Verification code sent to your email. Please verify to create your account.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during signup",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const pendingData = pendingVerifications[email];

    // Check if data exists and is not expired
    if (!pendingData || pendingData.expiresAt < Date.now()) {
      return res.status(400).json({
        status: "error",
        message:
          "Verification code is invalid or has expired. Please sign up again.",
      });
    }

    // Check if the code matches
    if (pendingData.verificationCode !== verificationCode) {
      return res.status(400).json({
        status: "error",
        message: "Invalid verification code.",
      });
    }

    // --- User Creation Logic (moved from original signup) ---
    const { firstName, middleName, lastName, phone_number, password } =
      pendingData;
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `CECC${currentYear}-`;
    const highestUser = await User.findOne(
      { _id: new RegExp(`^${prefix}`) },
      { _id: 1 },
      { sort: { _id: -1 } }
    );
    let nextNumber = 1;
    if (highestUser && highestUser._id) {
      nextNumber = parseInt(highestUser._id.split("-")[1]) + 1;
    }
    const highestProfile = await Profile.findOne(
      { _id: new RegExp(`^${prefix}`) },
      { _id: 1 },
      { sort: { _id: -1 } }
    );
    if (highestProfile && highestProfile._id) {
      const profileNumber = parseInt(highestProfile._id.split("-")[1]);
      if (profileNumber >= nextNumber) {
        nextNumber = profileNumber + 1;
      }
    }
    const customId = `${prefix}${nextNumber.toString().padStart(4, "0")}`;

    const newUser = await User.create({
      _id: customId,
      firstName,
      middleName,
      lastName,
      phone_number,
      email,
      password, // Already hashed
      role: "patient",
      patientId: customId,
    });

    try {
      await Profile.create({
        _id: newUser._id,
        patientId: newUser._id,
        firstName,
        middleName,
        lastName,
        email,
        phone_number,
        address: "",
        dob: "",
      });
    } catch (profileError) {
      await User.findByIdAndDelete(newUser._id);
      return res.status(400).json({
        status: "error",
        message: profileError.message || "Error creating profile",
      });
    }

    // Cleanup the pending verification data
    delete pendingVerifications[email];

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({
      status: "success",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during verification",
    });
  }
};

// In controllers/UserController.js

export const getMe = async (req, res) => {
  try {
    // The user ID is set by the auth middleware
    const userId = req.user.id;

    // 1. Fetch the core user data (for role, email) from the User collection
    const authUser = await User.findById(userId).select("-password");

    if (!authUser) {
      return res.status(404).json({
        status: "error",
        message: "Authentication record not found for this user.",
      });
    }

    // 2. Fetch the detailed profile data (for name, profilePicture) from the Profile collection
    const userProfile = await Profile.findById(userId);

    // 3. Merge the two objects to create a complete user representation
    // We start with the profile data and spread the auth data on top.
    // This ensures core fields like 'role' and 'email' from the User model are authoritative.
    const fullUser = {
      ...(userProfile ? userProfile.toObject() : {}), // Safely spread profile data
      ...(authUser ? authUser.toObject() : {}), // Spread auth data
      id: authUser._id, // Ensure the primary ID is consistent
      _id: authUser._id,
    };

    // 4. Send the complete, merged user object to the frontend
    res.status(200).json({
      status: "success",
      data: {
        user: fullUser,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user data",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if user is a patient
    if (user.role !== "patient") {
      return res.status(403).json({
        status: "error",
        message: "Only patients can login here",
      });
    }

    // For admin users, make sure they have a valid _id
    if (user.role === "patient" && !user._id.startsWith("CECC")) {
      return res.status(400).json({
        status: "error",
        message: "Account has invalid ID format. Please contact support.",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      _id: user._id, // Include both id and _id for backward compatibility
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phone_number: user.phone_number,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      status: "success",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during login",
    });
  }
};

// Add this new function in UserController.js

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // SECURE CHECK: Ensure only admin or owner can log in here
    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to access this resource.",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Prepare user data for response (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
    };

    res.status(200).json({
      status: "success",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Admin Login error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during login.",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current and new passwords are required.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Current password is incorrect." });
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res
      .status(200)
      .json({ status: "success", message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while changing password.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Only allow users to delete their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        status: "error",
        message: "You can only delete your own account",
      });
    }

    // Delete the user
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while deleting the account",
    });
  }
};
