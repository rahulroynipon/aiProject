import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// Utility function to check if the user is authenticated
const isAuthenticated = () => {
  const token = Cookies.get("accessToken");
  console.log(token);
  return !!token;
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
