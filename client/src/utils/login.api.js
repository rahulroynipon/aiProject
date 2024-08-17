import axios from "axios";
import { handleError } from "./handleError";

export const fetchWithToken = async (url, token) => {
  try {
    const response = await axios.post(
      url,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "API request failed");
    } else {
      throw new Error("API request failed");
    }
  }
};

export const fetchLogin = async ({ email, password }) => {
  try {
    const response = await axios.post(
      "/api/auth/login",
      { email, password },
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

export const fetchResetPass = async (email) => {
  try {
    const response = await axios.get(`/api/users/reset-link/${email}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
