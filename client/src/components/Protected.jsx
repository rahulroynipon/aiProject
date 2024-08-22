import React from "react";
import { Redirect, Route } from "react-router-dom";
import Cookies from "js-cookie";


const isAuthenticated = () => {
  const token = Cookies.get("accessToken");
  return !!token;
};

// Protected Route Component
const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
