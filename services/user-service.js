const User = require("../models/user");
const RefreshToken = require('../models/refreshToken');
const jwt = require("jsonwebtoken");

const authenticateUser = async (username, password) => {
    return User.getUserByUsername(username)
    .then(user => {
      if(!user)
        return { status: 401, msg: 'User could not be found'}
        // User found - compare password
        return User.comparePassword(password, user.password)
        .then(isMatch => {
          if(!isMatch)
            return { status: 401, msg: 'User could not be authenticated'};
          // Password matched
          const { password, __v, _id, ...payload } = user._doc;
          payload["sub"] = user._id; 
          // Access token
          const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
            expiresIn: 36000, //10 hours
          });
          // Refresh token
          const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
            expiresIn: 604800, // 1 week
          });
          var refreshTokenEntry = new RefreshToken({
            userId: user._id,
            token: refreshToken,
          });
          return RefreshToken.addRefreshToken(refreshTokenEntry)
          .then(token => {
            if(!token)
              return { status: 500, msg: 'Error adding refresh token'};
              // return successful json
              return { 
                status: 200, 
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                  id: user._id,
                  name: user.name,
                  username: user.username,
                  email: user.email
                }
              }
          })
          .catch(err => { throw err });
        })
        .catch(err => { throw err });
    })
    .catch(() => { return { status: 500, msg: 'Something went wrong'}});
}

const updateProfileInformation = (user, profileInfo) => {
  return User.updateProfileInformation(user, profileInfo)
    .then((user) => {
      if (user) return { status: 200, msg: "Profile information updated"};
      else return { status: 500, msg: "User could not be found"};
    })
    .catch(() =>
      { return { status: 500, message: "Something went wrong adding profile information" }}
    );
};

module.exports = { authenticateUser, updateProfileInformation };
