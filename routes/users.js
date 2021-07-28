const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserService = require('../services/user-service');
const RefreshTokenService = require('../services/refresh-token-service');
const UserRegisterService = require('../services/user-register-service');
const UserProfileService = require('../services/user-profile-service');

// Register
router.post("/register", async (req, res) => {
  const { status, body } = await UserRegisterService.registerUser(
    req.body.name, req.body.email, req.body.username, req.body.password);
    return res.status(status).json(body);
});

// Authenticate
router.post("/authenticate", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const { status, body } = await UserService.authenticateUser(username, password);
  return res.status(status).json(body);
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { status, body } = await UserProfileService.getProfile(req.user);
    res.status(status).json(body);
  }
);

// Test Refresh
router.get("/refresh", async (req, res) => {
  const { status, body } = await RefreshTokenService.refreshToken(req.body.token)
  return res.status(status).json(body);
});

router.get("/check-username", async (req, res) => {
  const doesExist = await UserRegisterService.checkUsername(req.query.username);
  res.json(doesExist);
});

router.get("/check-email", async (req, res) => {
  const doesExist = await UserRegisterService.checkUserEmail(req.query.email);
  res.json(doesExist);
});

router.get('/logout', async (req, res) => {
  const { status, body } = await RefreshTokenService.removeRefreshToken(req.query.refreshToken);
  res.status(status).json(body);
})

router.post('/edit-profile', 
passport.authenticate("jwt", { session: false }),
async (req, res) => {
  const { status, body } = await UserProfileService.updateProfileInformation(req.user._id, req.body.profileInformation)
  res.status(status).json(body);
})

router.post('/update-profile-image', 
passport.authenticate("jwt", { session: false }),
async (req, res) => {
  const { status, body } = await UserProfileService.updateProfileImage(req.user._id, req.body?.imageUrl);
  res.status(status).json(body);
});


module.exports = router;
