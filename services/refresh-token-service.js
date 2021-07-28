const RefreshToken = require("../models/refreshToken");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const refreshToken = (refreshToken) => {
  try {
    const token = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // Create payload from verified token
    const { profileInformation, iat, exp, ...payload } = token;
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: 36000, //10 hours
    });
    return {
      status: 200,
      body: {
        accessToken: accessToken,
        user: {
          id: token.sub,
          name: token.name,
          username: token.username,
          email: token.email,
        },
      },
    };
  } catch (err) {
    return { status: 403, body: "Token could not be verified" };
  }
};

const removeRefreshToken = (refreshToken) => {
  return RefreshToken.removeRefreshToken(refreshToken)
    .then((token) => {
      if (token.deletedCount > 0)
        return { status: 200, body: "User successfully logged out" };
      else return { status: 200, body: "No refresh token found" };
    })
    .catch(() => {
      return { status: 500, body: "Error removing refresh token" };
    });
};

module.exports = { refreshToken, removeRefreshToken };
