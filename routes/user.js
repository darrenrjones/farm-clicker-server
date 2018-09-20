'use strict';
const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Crops = require('../models/crops');

const missingField = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');
const trimmedFields = require('../helper/trimmedFields');
const tooBigOrTooSmall = require('../helper/tooBigOrTooSmall');

const passport = require('passport');


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

//get full user with populated crops
// router.get('/:id', jwtAuth, (req,res,next) => {
//   const { id } = req.params;
//   User.find({id})
//     .populate('crops')
//     // .populate('animals')
//     .then(result => {
//       res.json(result);
//     })
//     .catch(err => {
//       next(err);
//     })
// });

//save
router.put('/save/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params;
  const newCrops = req.body;

  const updatePromises = newCrops.map(newCrop => {
    return Crops.findByIdAndUpdate(newCrop.id, {$set: {count:newCrop.count, total: newCrop.total, price:newCrop.price}})
  });

  Promise.all(updatePromises)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err.message);
    })
});



module.exports = router;