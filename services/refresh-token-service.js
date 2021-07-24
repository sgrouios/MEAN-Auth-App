const RefreshToken = require('../models/refreshToken');

const removeRefreshToken = (refreshToken) => {
      return RefreshToken.removeRefreshToken(refreshToken)
      .then((token) => {
          if(token.deletedCount > 0)
            return { status: 200, msg: 'User successfully logged out'}
          else
            return { status: 200, msg: 'No refresh token found'}  
      })
      .catch(() => { return { status: 500, msg: 'Error removing refresh token' } }) 
}

module.exports = { removeRefreshToken };