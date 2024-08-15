import axios from "axios";

export const fetchRenewPass = async ({ code, token, password, retype }) => {
  try {
    // Validate password and retype match
    if (password !== retype) {
      throw {
        status: 400,
        message: "Passwords do not match",
      };
    }

    // Validate password length
    if (password.length < 6) {
      throw {
        status: 400,
        message: "Password must be at least 6 characters long",
      };
    }

    // Make API request to reset password
    const response = await axios.patch(
      `/api/users/reset-password`,
      {
        code,
        token,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);

    // Handle custom errors
    if (error.status === 400) {
      throw error;
    }

    // Handle Axios errors
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || "Request failed",
      };
    }

    // Handle network or unexpected errors
    throw {
      status: 500,
      message: "Request failed due to a network error",
    };
  }
};
