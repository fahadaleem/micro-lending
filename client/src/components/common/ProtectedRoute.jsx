import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Wrap a route element with <ProtectedRoute>. If user exists in store, render children.
 * Otherwise redirect to /login.
 */
export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return children;
}
