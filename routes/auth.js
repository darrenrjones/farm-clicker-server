'use strict';
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const passport = require('passport');
// const localStrategy = require('../auth/local');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const User = require('../models/user');

const options = { session: false, failWithError: true };

const localAuth = passport.authenticate('local', options);

const missingField = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');
const trimmedFields = require('../helper/trimmedFields');
const tooBigOrTooSmall = require('../helper/tooBigOrTooSmall');

function createAuthToken (user) {  
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
};

// get all users for testing purpose
router.get('/', (req,res) => {
  User.find()
    .then(results => {
      res.json(results);
    });
});

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/register', (req, res, next) => {

  //user input checks from helper folder
  missingField(['username', 'password', 'farmname' ], req);
  nonStringField(req);
  trimmedFields(['username', 'password'],req);
  tooBigOrTooSmall(req);

  const { username, farmname, password } = req.body;

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username, 
        farmname,
        password: digest
      };
      return User.create(newUser)
    })
    .then(result => {
      return res.status(201)
        .location(`/api/users/${result.id}`)
        .json(result);
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
        return err;
      }
      next(err);
    });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = router;