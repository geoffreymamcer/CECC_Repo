import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log('Auth middleware: No token provided');
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure decoded has both id and _id for backward compatibility
    if (!decoded.id && decoded._id) {
      decoded.id = decoded._id;
    } else if (!decoded._id && decoded.id) {
      decoded._id = decoded.id;
    }
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: `Access denied. ${role} role required.`,
      });
    }
    next();
  };
};
