import User from "../models/User.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { firstName, middleName, lastName, phone_number, email, password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    // Generate a custom ID for the new user
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `CECC${currentYear}-`;

    // Find the highest existing number for this year in Users
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

    // Check for existing profiles with the same ID pattern
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

    // Generate the final ID
    const customId = `${prefix}${nextNumber.toString().padStart(4, "0")}`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with the custom ID
    const newUser = await User.create({
      _id: customId,
      firstName,
      middleName,
      lastName,
      phone_number,
      email,
      password: hashedPassword,
      role: "patient", // Default role for signup
      patientId: customId // Set patientId to the same value for backward compatibility
    });

    // Create a profile with the same _id as the user
    try {
      await Profile.create({
        _id: newUser._id, // Use the same custom ID
        patientId: newUser._id, // Set patientId to the same value for backward compatibility
        firstName,
        middleName,
        lastName,
        email,
        phone_number,
        address: "", // To be filled by admin
        dob: "", // To be filled by admin
      });
    } catch (profileError) {
      // Cleanup: delete the user if profile creation fails
      await User.findByIdAndDelete(newUser._id);
      return res.status(400).json({
        status: "error",
        message: profileError.message || "Error creating profile",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      middleName: newUser.middleName,
      lastName: newUser.lastName,
      phone_number: newUser.phone_number,
      email: newUser.email,
      role: newUser.role
    };

    res.status(201).json({
      status: "success",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during signup",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // The user ID is set by the auth middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Create a user response object with consistent id properties
    const userResponse = {
      ...user.toObject(),
      id: user._id,  // Ensure id is set to _id for consistency
    };

    res.status(200).json({
      status: "success",
      data: {
        user: userResponse,
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
      role: user.role
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
