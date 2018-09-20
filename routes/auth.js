'use strict';
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const passport = require('passport');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const User = require('../models/user');

const options = { session: false, failWithError: true };

const localAuth = passport.authenticate('local', options);

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

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  User.findById(req.user.id)
    .populate('crops')
    .populate('animals')
    .then(user => {
      const authToken = createAuthToken(user);
      return res.json({authToken})
    })
});

module.exports = router;