'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Animals = require('../models/animals');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// get user animals
// router.get('/', (req,res,next) => {
//   console.log('get user animals entered from routes/animals.js')
// const user = req.user.id;

//   Animals.find({user})
//     .then(results => {
//       res.json(results);
//     });
// });

module.exports = router;