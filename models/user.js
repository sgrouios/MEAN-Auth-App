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
    }
});

const User = mongoose.model('User', UserSchema);

const getUserById = (id, callback) => {
    User.findById(id, callback);
}

const getUserByUsername = (username) => {
    const query = { username: username };
    return User.findOne(query).exec();
}

const addUser = (newUser) => {
    return bcrypt.genSalt(10)
    .then((salt) => {
        return bcrypt.hash(newUser.password, salt)
        .then((hash) => {
            newUser.password = hash;
            return newUser.save();
        })
        .catch((err) => {throw err});
    })
    .catch((err) => {throw err});
}

const comparePassword = (candidatePassword, hash) => {
    return bcrypt.compare(candidatePassword, hash);
}

const getUserByEmail = (email) => {
    const query = { email: email };
    return User.findOne(query).exec();
}

module.exports = { User, getUserById, getUserByUsername, addUser, comparePassword, getUserByEmail }