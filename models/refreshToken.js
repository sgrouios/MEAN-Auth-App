const mongoose = require('mongoose');
const config = require('../config/database');

// RefreshToken schema
const RefreshTokenSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const RefreshToken = module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);

module.exports.getRefreshTokenByUserId = (userId, callback) => {
    const query = { userId: userId };
    RefreshToken.findOne(query, callback);
}

module.exports.addRefreshToken = (refreshToken, callback) => {
    module.exports.getRefreshTokenByUserId(refreshToken.userId, (err, existingRefreshToken) => {
        if(err) throw err;
        if(existingRefreshToken){
            existingRefreshToken.token = refreshToken.token;
            existingRefreshToken.save(callback);
        }
        else
            refreshToken.save(callback);
    });
}

module.exports.removeRefreshToken = (refreshToken, callback) => {
    RefreshToken.deleteOne({ token: refreshToken }, callback);
}