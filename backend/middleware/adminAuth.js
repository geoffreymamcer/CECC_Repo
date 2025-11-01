import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminAuth = async (req, res, next) => {
  try {
    // This part of your code is correct and can remain the same
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    // --- THIS IS THE FIX ---
    // Define an array of roles that are allowed to access the route.
    const allowedRoles = ["admin", "owner"];

    // Check if the user exists and if their role is included in the allowed list.
    if (!user || !allowedRoles.includes(user.role)) {
      // If the user's role is not in the array, throw an error.
      throw new Error("User does not have the required permissions.");
    }

    // This part is also correct
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // --- MODIFIED --- A more informative error message
    res
      .status(403)
      .json({ message: "Forbidden: Administrator or Owner access required." });
  }
};
