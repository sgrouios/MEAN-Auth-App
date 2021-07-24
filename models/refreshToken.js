const mongoose = require('mongoose');

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

module.exports.getRefreshTokenByUserId = (userId) => {
    const query = { userId: userId };
    return RefreshToken.findOne(query).exec();
}

module.exports.addRefreshToken = (refreshToken) => {
    return module.exports.getRefreshTokenByUserId(refreshToken.userId)
    .then((existingToken) => {
        if(existingToken){
            existingToken.token = refreshToken.token;
            return existingToken.save();
        }
        else
            return existingToken.save();
    })
    .catch(() => { throw err });
}

module.exports.removeRefreshToken = (refreshToken) => {
    return RefreshToken.deleteOne({ token: refreshToken }).exec();
}