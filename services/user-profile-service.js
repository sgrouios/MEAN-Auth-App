const UserProfile = require('../models/userProfile');

const getProfile = (user) => {
    return UserProfile.getProfile(user._id)
    .then((profile) => { return { status: 200, body: {
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username, 
        profileInformation: profile?.profileInformation,
        profileImage: profile?.profileImage
    }}})
    .catch((err) => { return { status: 500, body: err }});
}

const updateProfileInformation = (userId, profileInfo) => {
    return UserProfile.updateProfileInformation(userId, profileInfo)
    .then((profile) => {
        if(profile)
            return { status: 200, body: 'Profile successfully updated' };
        else return { status: 500, body: "User could not be found"};
    })
    .catch((err) => {
        return { status: 500, body: err }
    });
  };

const updateProfileImage = (userId, image) => {
    return UserProfile.updateProfileImage(userId, image)
    .then((profile) => {
        if(profile)
            return { status: 200, body: 'Profile image successfully updated' };
        else return { status: 500, body: "User could not be found"};
    })
    .catch((err) => {
        return { status: 500, body: err }
    });
};

  module.exports = { getProfile, updateProfileInformation, updateProfileImage };