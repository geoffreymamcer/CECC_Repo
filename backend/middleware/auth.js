import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PatientAuth from "../models/patientAuth.js";

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("Auth middleware: No token provided");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    console.log(
      "Auth middleware: Token received:",
      token.substring(0, 20) + "..."
    );

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware: Decoded token:", decoded);

    // Fetch the complete user from database to ensure role is current
    let user = await User.findById(decoded.id || decoded._id).select(
      "-password"
    );
    // If not found in User, try PatientAuth
    if (!user) {
      user = await PatientAuth.findById(decoded.id || decoded._id).select(
        "-password"
      );
    }
    if (!user) {
      console.log(
        "Auth middleware: User not found for ID:",
        decoded.id || decoded._id
      );
      throw new Error("User not found");
    }

    console.log("Auth middleware: User found:", {
      id: user._id,
      role: user.role,
      email: user.email,
    });
    // Add user from database to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
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
