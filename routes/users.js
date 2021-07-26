const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const UserService = require('../services/user-service');
const RefreshTokenService = require('../services/refresh-token-service');
const UserRegisterService = require('../services/user-register-service');
const { json } = require('express');

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
  (req, res) => {
    res.json(
      { 
        id: req.user._id, 
        name: req.user.name, 
        email: req.user.email, 
        username: req.user.username, 
        profileInformation: req.user.profileInformation
    });
  }
);

// Test Refresh
router.get("/refresh", (req, res) => {
  // Verify token
  jwt.verify(req.body.token, process.env.REFRESH_SECRET, (err, decodedPayload) => {
    if (err) throw err;
    if (!decodedPayload)
      res.json(403, {
        success: false,
        msg: "Token provided could not be verified",
      });
    return;
  });
  // Find refresh token in db
  RefreshToken.findOne({ token: req.body.token }, (err, tokenEntry) => {
    if (err) throw err;
    if (!tokenEntry)
      return res.json(403, {
        success: false,
        msg: "This token does not exist",
      });

    // Get user attached to refreshToken
    User.getUserById(tokenEntry.userId, (err, user) => {
      if (err) throw err;
      if (!user)
        res.json(422, {
          success: false,
          msg: "User could not be found for token supplied",
        });
      const { password, __v, _id, ...payload } = user._doc;
      payload["sub"] = user._id;
      const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: 36000, //10 hours
      });

      return res.json({
        accessToken: accessToken,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    });
  });
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
  const { status, body } = await UserService.updateProfileInformation(req.user, req.body.profileInformation, res);
  res.status(status).json(body);
})

  // router.post('/update-profile-image', 
  // passport.authenticate("jwt", { session: false }),
  // (req, res) => {
  //   /* Use Amazon S3 to store url instead */
  //   User.updateUserImage(req.user, req.body.imageUrl, (err, user) => {
  //     if(err) 
  //       return res.status(422).json('Could not update user image');
  //     if(!user)
  //       return res.status(500).json('User could not be found');
  //     else
  //       return res.status(200).json('User profile image updated');
  //   })
  // });

module.exports = router;
