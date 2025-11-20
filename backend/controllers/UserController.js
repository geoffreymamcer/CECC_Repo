import User from "../models/User.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccountCreationEmail,
} from "../services/emailService.js";
import mongoose from "mongoose";
import crypto from "crypto";

const pendingVerifications = {};
const passwordResetTokens = {};

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // SECURITY: Always send a generic success message to prevent user enumeration.
    // This stops attackers from discovering which emails are registered.
    if (!user) {
      return res.status(200).json({
        status: "success",
        message:
          "If an account with that email exists, a password reset code has been sent.",
      });
    }

    // Generate a 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the reset code and its expiry (e.g., 10 minutes)
    passwordResetTokens[email] = {
      code: resetCode,
      expiresAt: Date.now() + 600000, // 10 minutes from now
    };

    // Send the code to the user's email
    await sendPasswordResetEmail(email, resetCode, user.firstName);

    res.status(200).json({
      status: "success",
      message:
        "If an account with that email exists, a password reset code has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while initiating the password reset.",
    });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const storedToken = passwordResetTokens[email];

    if (!storedToken) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired reset code." });
    }

    // Check for expiration
    if (Date.now() > storedToken.expiresAt) {
      delete passwordResetTokens[email]; // Clean up expired token
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired reset code." });
    }

    // Check if codes match
    if (storedToken.code !== code) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid reset code." });
    }

    res.status(200).json({
      status: "success",
      message: "Code verified successfully.",
    });
  } catch (error) {
    console.error("Verify Reset Code error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while verifying the code.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;

    // --- SECURITY: Re-verify the token one last time ---
    const storedToken = passwordResetTokens[email];
    if (
      !storedToken ||
      storedToken.code !== code ||
      Date.now() > storedToken.expiresAt
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset code. Please start over.",
      });
    }

    // Validate passwords
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "Passwords do not match." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // This should theoretically not happen if the first step was followed, but it's a good safeguard.
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // --- SECURITY: Invalidate the token immediately after use ---
    delete passwordResetTokens[email];

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while resetting your password.",
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    // 6️⃣ ✨ START: DESTRUCTURE phone_number AND UPDATE VALIDATION
    const { name, email, password, role, phone_number } = req.body;

    // Validate input
    if (!name || !email || !password || !role || !phone_number) {
      return res.status(400).json({
        status: "error",
        message:
          "Please provide all required fields: name, email, phone number, password, and role.",
      });
    }
    // 6️⃣ ✨ END: DESTRUCTURE phone_number AND UPDATE VALIDATION

    const nameParts = name.trim().split(" ");
    if (nameParts.length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both a first and last name.",
      });
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    if (role !== "Admin" && role !== "Owner") {
      return res.status(400).json({
        status: "error",
        message: "Role must be either 'Admin' or 'Owner'.",
      });
    }

    // 7️⃣ ✨ START: CHECK FOR EXISTING EMAIL OR PHONE NUMBER
    const existingUser = await User.findOne({
      $or: [{ email }, { phone_number }],
    });
    if (existingUser) {
      let message = "User with this ";
      if (existingUser.email === email) {
        message += "email";
      } else {
        message += "phone number";
      }
      message += " already exists";
      return res.status(400).json({
        status: "error",
        message,
      });
    }
    // 7️⃣ ✨ END: CHECK FOR EXISTING EMAIL OR PHONE NUMBER

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 8️⃣ ✨ START: ADD phone_number TO THE NEW USER OBJECT
    const newAdmin = await User.create({
      _id: new mongoose.Types.ObjectId().toString(),
      firstName,
      lastName,
      email,
      phone_number,
      password: hashedPassword,
      role: role.toLowerCase(),
    });
    // 8️⃣ ✨ END: ADD phone_number TO THE NEW USER OBJECT

    res.status(201).json({
      status: "success",
      message: "Admin account created successfully",
      data: {
        id: newAdmin._id,
        name: `${newAdmin.firstName} ${newAdmin.lastName}`,
        email: newAdmin.email,
        role: newAdmin.role.charAt(0).toUpperCase() + newAdmin.role.slice(1),
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Admin error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during admin creation",
    });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "owner"] } }).sort({
      createdAt: -1,
    });

    const formattedAdmins = admins.map((admin) => ({
      id: admin._id,
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: admin.role.charAt(0).toUpperCase() + admin.role.slice(1),
      createdAt: admin.createdAt,
    }));

    res.status(200).json({
      status: "success",
      data: formattedAdmins,
    });
  } catch (error) {
    console.error("Get Admins error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while fetching admins",
    });
  }
};
export const updateAdminRole = async (req, res) => {
  try {
    const targetUserId = req.params.id; // The ID of the user to update
    const { role: newRole } = req.body; // The new role ("Admin" or "Owner")
    const requestingUserId = req.user.id; // The ID of the logged-in user making the request

    // Security Rule: Prevent users from changing their own role.
    if (targetUserId === requestingUserId) {
      return res.status(403).json({
        status: "error",
        message: "You cannot change your own role.",
      });
    }

    // Find the user to be updated
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    // Security Rule: Prevent changing the role of an Owner.
    // This is a safeguard; you might decide only a specific super-user can do this.
    if (targetUser.role === "owner") {
      return res.status(403).json({
        status: "error",
        message: "The role of an Owner cannot be changed.",
      });
    }

    // Validate the new role and update the user
    const newRoleLower = newRole.toLowerCase();
    if (newRoleLower !== "admin" && newRoleLower !== "owner") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid role specified." });
    }

    targetUser.role = newRoleLower;
    await targetUser.save();

    // Send back the updated user data so the frontend can update its state
    const updatedAdminData = {
      id: targetUser._id,
      name: `${targetUser.firstName} ${targetUser.lastName}`,
      email: targetUser.email,
      role: newRole, // Send back the capitalized version
      createdAt: targetUser.createdAt,
    };

    res.status(200).json({
      status: "success",
      message: `User role successfully updated to ${newRole}.`,
      data: updatedAdminData,
    });
  } catch (error) {
    console.error("Update Admin Role error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the user role.",
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const requestingUserId = req.user.id;

    // Security Rule: Prevent users from deleting themselves.
    if (targetUserId === requestingUserId) {
      return res.status(403).json({
        status: "error",
        message: "You cannot delete your own account here.",
      });
    }

    const userToDelete = await User.findById(targetUserId);
    if (!userToDelete) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    // Security Rule: Prevent Owner accounts from being deleted.
    if (userToDelete.role === "owner") {
      return res.status(403).json({
        status: "error",
        message: "Owner accounts cannot be deleted.",
      });
    }

    await User.findByIdAndDelete(targetUserId);

    res.status(200).json({
      status: "success",
      message: "Admin account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Admin error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the account.",
    });
  }
};

export const checkUserExists = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = await User.findById(patientId);
    res.status(200).json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: "Server error while checking user." });
  }
};
export const generatePatientAccount = async (req, res) => {
  try {
    const { patientId, email } = req.body;

    // Validation
    if (!patientId || !email) {
      return res
        .status(400)
        .json({ message: "Patient ID and email are required." });
    }

    // Check if a user account already exists for this patient ID
    const existingUserById = await User.findById(patientId);
    if (existingUserById) {
      return res
        .status(409)
        .json({ message: "An account already exists for this patient." });
    }

    // Check if an account with the provided email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({
          message: "An account with this email address already exists.",
        });
    }

    // Find the patient's profile
    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Patient profile not found." });
    }

    // Generate a secure temporary password (e.g., 8 characters)
    const temporaryPassword = crypto.randomBytes(6).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

    // Create the new user
    const newUser = await User.create({
      _id: profile._id, // Link the User._id to the Profile._id
      patientId: profile._id,
      firstName: profile.firstName,
      middleName: profile.middleName,
      lastName: profile.lastName,
      phone_number: profile.phone_number || profile.contact,
      email: email, // Use the email provided from the modal
      password: hashedPassword,
      role: "patient",
    });

    // Send the account creation email with the temporary password
    await sendAccountCreationEmail({
      email: newUser.email,
      firstName: newUser.firstName,
      temporaryPassword,
    });

    res.status(201).json({
      message: `Account successfully created for ${newUser.firstName} ${newUser.lastName}. Credentials have been sent to ${newUser.email}.`,
    });
  } catch (error) {
    console.error("Error generating patient account:", error);
    res.status(500).json({
      message: "An error occurred while generating the account.",
    });
  }
};
