'use strict';
const express = require('express');
const router = express.Router();

const User = require('../models/user');

const missingField = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');
const trimmedFields = require('../helper/trimmedFields');
const tooBigOrTooSmall = require('../helper/tooBigOrTooSmall');

router.get('/:id', (req,res,next) => {
  User.find({_id: req.params.id})
    .populate('crops')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    })
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

module.exports = router;