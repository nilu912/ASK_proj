import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header with Bearer token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }
  
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // if(user.role != 'admin'){
    //   return res.status(500).json({success: false, message: "Something wents wrong, please login again!"})
    // }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

export const protectForBoth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header with Bearer token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }
  
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // if(user.role != 'admin' && user.role != 'handler'){
    //   return res.status(500).json({success: false, message: "Something wents wrong, please login again!"})
    // }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

// Admin middleware - require admin role
export const admin = (req, res, next) => {
  
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

export const handler = (req, res, next) => {
  if(req.user && (req.user.role == 'handler' || req.user.role == 'admin')) {
    res.handlerName = req.user.name;
    next();
  } else {
    res.status(403).json({message: "Access denied, Handler only."})
  }
}

// Legacy export for backward compatibility
const verifyToken = protect;
export default verifyToken;
