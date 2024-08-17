import axios from "axios";
import { handleError } from "./handleError";

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
    handleError(error);
  }
};
