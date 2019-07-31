const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controllers will remove the logic / middleware from the routings files
// and keep the logic in a separeted file. That way the routers look cleaner
// and easy to read.

exports.createUser = (req, res, next) => {
  // encrypt the password with a thrid party package bcrypt
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(200).json({
            message: 'User Created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: "No password received."
      })
    });
}

// validates login and creates a token
exports.userLogin = (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) { // couldnt find email
        return res.status(401).json({
          message: 'Auth failed! Couldn\'t find email.'
        });
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password); // returns a promise, chained in the .then result
    })
    .then(result => {
      if(!result){ //password failed
        return res.status(401).json({
          message: 'Auth failed! Password not match.'
        });
      }

      // Success Auth
      // jwt.sign creates a new token based on the inputs you provide
      // the payload is send back to the browser to be stored
      // secret is to encry and decrypt later by the server
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id}, // data that should be fetched later on future server requests
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Success Auth.',
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => { // db error
      return res.status(401).json({
        message: 'Invalid authentication credentials!',
        error: err
      });
    });
}
