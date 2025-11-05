import express from "express";
import {
  register,
  login,
  getCurrentUser,
  getAllUsers,
} from "../controllers/authController.js";
import { authenticateToken } from "../utils/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get("/me", authenticateToken, getCurrentUser);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (for debugging)
 * @access  Public (should be protected in production)
 */
router.get("/users", getAllUsers);

export default router;
