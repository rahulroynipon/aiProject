import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { fetchWithToken } from "../utils/login.api";
import { parseJwt } from "../utils/parseJwt";

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log("Received token:", token);

    try {
      const decoded = parseJwt(token);
      console.log("Decoded JWT:", decoded);

      const data = await fetchWithToken(
        "/api/users/auth/google/callback",
        token
      );
      onSuccess(data);
    } catch (err) {
      console.error("Login failed:", err);
      onError(err);
    }
  };

  const handleError = (error) => {
    console.error("Google Login failed:", error);
    onError(error);
  };

  const REACT_APP_GOOGLE_CLIENT_ID =
    "759546156660-8jdbmbsl43tpg8n1qbgo5haesqpdljef.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
};

export default React.memo(GoogleLoginButton);
