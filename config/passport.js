const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_SECRET
  }, (jwt_payload, done) => {
      User.getUserById(jwt_payload.sub, (err, user) => {
        if (err) {
            console.log('error', err);
          return done(err, false);
        }
        if (user) {
            console.log('user', user);
          return done(null, user);
        } else {
        console.log('no user');
          return done(null, false);
        }
      });
    })
  );
};
