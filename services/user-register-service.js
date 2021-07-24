const User = require('../models/user');

const checkUserEmail = (email) => {
      return User.getUserByEmail(email)
      .then((user) => {
          if(user)
            return { doesExist: true };
          return { doesExist: false };  
      })
      .catch(() => { throw err });
}

const checkUsername = (username) => {
    return User.getUserByUsername(username)
    .then((user) => {
        if(user)
          return { doesExist: true };
        return { doesExist: false };  
    })
    .catch(() => { throw err });
}

module.exports = { checkUserEmail, checkUsername };