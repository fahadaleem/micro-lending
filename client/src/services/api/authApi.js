/**
 * Authentication API service
 * Connects to backend API endpoints using axios
 */

import apiClient from "./apiClient.js";

/**
 * Login user with email and password
 * @param {object} payload - { email, password }
 * @returns {Promise<object>} user object and token
 */
export async function login(payload) {
  const { email, password } = payload;

  const response = await apiClient.post("/api/auth/login", {
    email,
    password,
  });

  // Store token in localStorage
  if (response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
  }

  return response.data.data;
}

/**
 * Logout current user
 * @returns {Promise<object>} success message
 */
export async function logout() {
  // Remove token from localStorage
  localStorage.removeItem("token");
  return { message: "Logged out successfully" };
}

/**
 * Verify current token (for session validation)
 * @param {string} token - JWT token
 * @returns {Promise<object>} user object
 */
export async function verifyToken(token) {
  const response = await apiClient.get("/api/auth/me");
  return response.data.data;
}
