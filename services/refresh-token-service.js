const RefreshToken = require('../models/refreshToken');

const removeRefreshToken = (refreshToken) => {
      return RefreshToken.removeRefreshToken(refreshToken)
      .then((token) => {
          if(token.deletedCount > 0)
            return { status: 200, body: 'User successfully logged out'}
          else
            return { status: 200, body: 'No refresh token found'}  
      })
      .catch(() => { return { status: 500, body: 'Error removing refresh token' } }) 
}

module.exports = { removeRefreshToken };