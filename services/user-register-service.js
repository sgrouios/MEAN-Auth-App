const User = require('../models/user');

const registerUser = (name, email, username, password) => {
    let newUser = new User.User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    return User.User.findOne({ email: email })
    .then((user) => {
      if(user)
        return { status: 422, body: 'User with that email already exists'}
      return User.User.findOne({ username: username})
      .then((user) => {
        if(user)
          return { status: 422, body: 'User with that username already exists'};
            return User.addUser(newUser)
            .then((user) => {
              if(user)
                return { status: 200, body: 'User registered'}
            })
            .catch((err) => {throw err})
      })
      .catch((err) => {throw err})
    })
    .catch(() => {return { status: 500, body: 'User could not be registered'}})
  }

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

module.exports = { registerUser, checkUserEmail, checkUsername };