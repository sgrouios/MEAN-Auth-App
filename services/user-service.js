const User = require("../models/user");

const authenticateUser = async (username, password) => {
    
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
