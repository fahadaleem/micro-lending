import jwt from "jsonwebtoken";
import { ApiError } from "./errorMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "micro-lending-app-token";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new ApiError(401, "Access token is required");
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        throw new ApiError(403, "Invalid or expired token");
      }

      // Attach user info to request
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};
