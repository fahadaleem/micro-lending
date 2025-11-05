import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../utils/errorMiddleware.js";
import User from "../schema/User.js";

// JWT Secret (in production, use environment variable)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Register a new user
 */
export const register = asyncHandler(async (req, res, next) => {
  const { email, password, role, name } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Check if user already exists by email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = await User.create({
    email,
    password: hashedPassword,
    role: role || "finance_manager",
    name: name || "",
  });

  // Generate JWT token
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return user data (without password)
  const userResponse = {
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name || "",
    createdAt: newUser.createdAt,
  };

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: userResponse,
      token,
    },
  });
});

/**
 * Login user
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return user data (without password)
  const userResponse = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name || "",
  };

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: userResponse,
      token,
    },
  });
});

/**
 * Get current user (requires authentication)
 */
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Set by auth middleware

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userResponse = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name || "",
  };

  res.status(200).json({
    success: true,
    data: { user: userResponse },
  });
});

/**
 * Get all users (for debugging - remove in production)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    success: true,
    data: { users },
  });
});
