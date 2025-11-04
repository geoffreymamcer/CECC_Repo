import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PatientAuth from "../models/patientAuth.js";

export const auth = async (req, res, next) => {
  console.log(`[Auth] Middleware initiated for URL: ${req.originalUrl}`);
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("[Auth] No token provided. Access denied.");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    console.log(`[Auth] Token received. Verifying...`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Auth] Token decoded successfully:", decoded);

    let user = null;
    const userId = decoded.id || decoded._id;

    if (!userId) {
      console.log("[Auth] Token does not contain a user ID. Access denied.");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // ✨ --- THIS IS THE CRITICAL FIX --- ✨
    // First, try to find a user (admin/owner) in the 'User' collection.
    // We check if the ID is a valid MongoDB ObjectId before querying.
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(
        `[Auth] Attempting to find admin user with ObjectId: ${userId}`
      );
      user = await User.findById(userId).select("-password");
    }

    // If no admin user was found, search for a patient in the 'PatientAuth' collection.
    // We use findOne with the custom string ID, which is more reliable than findById here.
    if (!user) {
      console.log(
        `[Auth] No admin user found. Attempting to find patient with custom ID: ${userId}`
      );
      user = await PatientAuth.findOne({ _id: userId }).select("-password");
    }
    // ✨ --- END OF FIX --- ✨

    if (!user) {
      console.log(
        `[Auth] CRITICAL: No user or patient found for ID: ${userId}. Access denied.`
      );
      return res.status(401).json({ message: "User not found for this token" });
    }

    console.log(
      `[Auth] ✅ User authenticated successfully: { id: ${user._id}, role: ${user.role} }`
    );
    req.user = user;
    next(); // <-- This is the crucial call to proceed to the next step (the controller)
  } catch (error) {
    console.error(
      "🔴 [Auth] An error occurred in the authentication middleware:",
      error.message
    );
    res.status(401).json({ message: "Token is not valid or has expired" });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Permission denied" });
    }
    next();
  };
};

// This is the NEW, corrected code.
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      console.log("requireAdmin: No user in request");
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    console.log("requireAdmin: Checking role:", req.user.role);

    // Define a list of all roles that have admin-level access
    const authorizedRoles = ["admin", "owner"];

    // Check if the user's role is in our authorized list
    if (!authorizedRoles.includes(req.user.role)) {
      console.log(
        `requireAdmin: User role '${req.user.role}' is not authorized.`
      );
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    console.log("requireAdmin: Admin access granted");
    next();
  } catch (error) {
    console.error("requireAdmin error:", error);
    res.status(500).json({ message: "Server error checking admin privileges" });
  }
};
