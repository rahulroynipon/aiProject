const handleError = (error) => {
  if (error.response) {
    throw {
      status: error.response.status,
      message: error.response.data.message || "Something went wrong",
    };
  } else if (error.request) {
    throw { status: 500, message: "Network error. Please try again later." };
  } else {
    throw { status: 500, message: error.message };
  }
};

export { handleError };
