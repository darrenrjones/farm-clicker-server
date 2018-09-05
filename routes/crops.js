'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Crops = require('../models/crops');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//get user crops
router.get('/', (req,res,next) => {
const user = req.user.id;

  Crops.find({user})
    .then(results => {
      res.json(results);
    });
});

//get single crop

//purchase crop
router.post('/', (req,res,next) => {
  const user = req.user.id;
  const { type, currentAmount, price } = req.body;
  const newCrop = { type, currentAmount, price, user };

  if(!type || !currentAmount || !price){
    const err = new Error('something happened with client... missing part of req.body');
    err.status = 400;
    return next(err);
  }

  Crops.create(newCrop)
    .then(result => {
      res.location(`${req.originalUrl}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

// increment currentAmount due to purchasing


module.exports = router;