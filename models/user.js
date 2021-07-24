const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    profileInformation: {
        type: String
    }/*,
    profileImage: {
        data: Buffer,
        contentType: String
    }*/
});

const User = module.exports = mongoose.model('User', UserSchema);

const getUserById = (id, callback) => {
    User.findById(id, callback);
}

const getUserByUsername = (username) => {
    const query = { username: username };
    return User.findOne(query).exec();
}

const addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err)
             throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

const comparePassword = (candidatePassword, hash, callback) => {
    /* bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) 
            throw err;
        callback(null, isMatch);
    }) */
    return bcrypt.compare(candidatePassword, hash);
}

const getUserByEmail = (email) => {
    const query = { email: email };
    return User.findOne(query).exec();
}

const updateProfileInformation = (user, profileInfo) => {
    user.profileInformation = profileInfo;
    return user.save();
}

const updateUserImage = (user, imageUrl, callback) => {
    /* user.profileImage = imageUrl;
    user.save(callback); */
}

module.exports = { getUserById, getUserByUsername, addUser, comparePassword, getUserByEmail, updateProfileInformation, updateUserImage }