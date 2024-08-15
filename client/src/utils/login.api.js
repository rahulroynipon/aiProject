import axios from "axios";

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
      "/api/users/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || "Login failed",
      };
    } else {
      throw {
        status: 500,
        message: "Login failed due to a network error",
      };
    }
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
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || "Request failed",
      };
    } else {
      throw {
        status: 500,
        message: "Request failed due to a network error",
      };
    }
  }
};
