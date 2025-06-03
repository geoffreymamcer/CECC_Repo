import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log('Auth middleware: No token provided');
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    console.log('Auth middleware: Token received:', token.substring(0, 20) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Decoded token:', decoded);
    
    // Fetch the complete user from database to ensure role is current
    const user = await User.findById(decoded.id || decoded._id).select('-password');
    
    if (!user) {
      console.log('Auth middleware: User not found for ID:', decoded.id || decoded._id);
      throw new Error('User not found');
    }

    console.log('Auth middleware: User found:', {
      id: user._id,
      role: user.role,
      email: user.email
    });
    
    // Add user from database to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      console.log('requireAdmin: No user in request');
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    console.log('requireAdmin: Checking role:', req.user.role);
    
    if (req.user.role !== "admin") {
      console.log('requireAdmin: User is not admin:', req.user.role);
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    console.log('requireAdmin: Admin access granted');
    next();
  } catch (error) {
    console.error('requireAdmin error:', error);
    res.status(500).json({ message: "Server error checking admin privileges" });
  }
};
