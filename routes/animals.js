'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Animals = require('../models/animals');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//route not used in app

// router.get('/', (req,res,next) => {
//   const user = req.user.id;
  
//     Animals.find({user})
//       .then(results => {
//         res.json(results);
//       });
//   });

module.exports = router;