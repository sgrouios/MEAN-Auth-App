const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");

// Register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) res.status(400).json("User could not be registered");
    else res.status(200).json("User registered");
  });
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) return res.status(401).json('User could not be found');

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const { password, __v, _id, ...payload } = user._doc;
        payload["sub"] = user._id;
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
          expiresIn: 36000, //10 hours
        });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
          expiresIn: 604800, // 1 week
        });

        var refreshTokenEntry = new RefreshToken({
          userId: user._id,
          token: refreshToken,
        });

        RefreshToken.addRefreshToken(refreshTokenEntry, (err, token) => {
          if (err) throw err;
          if (!token)
            return res.status(500).json('Error adding refresh token');

          return res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
            },
          });
        });
      } else {
        return res.status(401).json('User could not be authenticated');
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
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
router.get("/refresh", (req, res, next) => {
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

router.get("/check-username", (req, res, next) => {
  User.getUserByUsername(req.query.username, (err, user) => {
    if (err) throw err;
    if (user) return res.json({ doesExist: true });
    return res.json({ doesExist: false });
  });
});

router.get("/check-email", (req, res, next) => {
  User.getUserByEmail(req.query.email, (err, user) => {
    if (err) throw err;
    if (user) return res.json({ doesExist: true });
    return res.json({ doesExist: false });
  });
});

router.get('/logout', (req, res, next) => {
  RefreshToken.removeRefreshToken(req.query.refreshToken, (err, refreshToken) => {
    if(err) throw err;
    if(refreshToken.deletedCount > 0) return res.status(200).json('User successfully logged out');
    else
      return res.status(200).json('No refresh token found');
  })
})

router.post('/edit-profile', 
passport.authenticate("jwt", { session: false }),
(req, res) => {
  User.updateProfileInformation(req.user, req.body.profileInformation, (err, profile) => {
    if(err)
      return res.status(500).status('Something went wrong adding profile information');
    if(!profile)
      return res.status(500).json('User could not be found');
    else
      return res.status(200).json('Profile information updated');
  })
})

  router.post('/update-profile-image', 
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    /* Use Amazon S3 to store url instead */
    User.updateUserImage(req.user, req.body.imageUrl, (err, user) => {
      if(err) 
        return res.status(422).json('Could not update user image');
      if(!user)
        return res.status(500).json('User could not be found');
      else
        return res.status(200).json('User profile image updated');
    })
  });

module.exports = router;
