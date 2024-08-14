export const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = decodeURIComponent(
      atob(base64Url).replace(/\+/g, " ").replace(/\//g, "_").replace(/=/g, "")
    );
    return JSON.parse(base64);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
};
