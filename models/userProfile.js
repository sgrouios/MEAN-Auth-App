const mongoose = require('mongoose');

// UserProfile schema
const UserProfileSchema = mongoose.Schema({
    profileInformation: {
        type: String
    },
    profileImage: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

const getProfile = (userId) => {
    return UserProfile.findOne({ userId: userId }).exec()
    .then((profile) => {
        if(profile){
            return profile;
        }
        else
            throw new Error('No profile data found');
    })
    .catch((err) => { throw err });
}

const addProfile = (profile) => {
    return profile.save();
}

const updateProfileInformation = (userId, profileInfo) => {
    return UserProfile.findOne({ userId: userId}).exec()
    .then((profile) => {
        if(profile){
            profile.profileInformation = profileInfo;
            return profile.save();
        }
        else {
            const newUserProfile = new UserProfile({ profileInformation: profileInfo, userId: new mongoose.Types.ObjectId(userId)});
            return newUserProfile.save();
        }
    })
    .catch((err) => { throw err});
}

const updateProfileImage = (userId, image) => {
    return UserProfile.findOne({ userId: userId}).exec()
    .then((profile) => {
        if(profile){
            profile.profileImage = image;
            return profile.save();
        }
        else {
            const newUserProfile = new UserProfile({ profileImage: image, userId: new mongoose.Types.ObjectId(userId)});
            return newUserProfile.save();
        }
    })
    .catch((err) => { throw err});
}
module.exports = { UserProfile, addProfile, getProfile, updateProfileInformation, updateProfileImage }