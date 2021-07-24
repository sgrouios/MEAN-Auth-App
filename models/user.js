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

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
    const query = { username: username };
    User.findOne(query, callback);
}

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err)
             throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) 
            throw err;
        callback(null, isMatch);
    })
}

module.exports.getUserByUsername = (username, callback) => {
    const query = { username: username };
    User.findOne(query, callback);
}

module.exports.getUserByEmail = (email, callback) => {
    const query = { email: email };
    User.findOne(query, callback);
}

module.exports.updateProfileInformation = (user, profileInfo, callback) => {
    user.profileInformation = profileInfo;
    user.save(callback);
}

module.exports.updateUserImage = (user, imageUrl, callback) => {
    /* user.profileImage = imageUrl;
    user.save(callback); */
}