'use strict';
const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Crops = require('../models/crops');
const Animals = require('../models/animals');

const missingField = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');
const trimmedFields = require('../helper/trimmedFields');
const tooBigOrTooSmall = require('../helper/tooBigOrTooSmall');

const passport = require('passport');


router.post('/register', (req, res, next) => {

  //user input checks from helper folder
  missingField(['username', 'password', 'farmname'], req);
  nonStringField(req);
  trimmedFields(['username', 'password'], req);
  tooBigOrTooSmall(req);

  let userId;
  const seedCrops1 = require('../seed/crops1');
  const seedAnimals1 = require('../seed/animals1');
  const { username, farmname, password } = req.body;

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          status: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password)
    })
    .then(digest => {
      const newUser = {
        username,
        farmname,
        password: digest,
        cash: 0
      };
      return User.create(newUser);
    })
    .then(result => {
      userId = result.id;
      return res.status(201)
        .location(`/api/users/${userId}`)
        .json(result);
    })
    .then(() => {
      seedCrops1.forEach((crop) => crop.user = userId);
      seedAnimals1.forEach((animal) => animal.user = userId);
      return Promise.all([
        Crops.insertMany(seedCrops1),
        Crops.createIndexes(),
        Animals.insertMany(seedAnimals1),
        Animals.createIndexes(),
      ]);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
        return err;
      }
      next(err);
    });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.put('/save/:id', jwtAuth, (req, res, next) => {
  const user = req.body;

  const cropUpdatePromises = user.crops.map(newCrop => {
    return Crops.findByIdAndUpdate(newCrop.id, { $set: { count: newCrop.count, price: newCrop.price, manager: newCrop.manager } });
  });

  const animalUpdatePromises = user.animals.map(newAnimal => {
    return Animals.findByIdAndUpdate(newAnimal.id, { $set: { count: newAnimal.count, price: newAnimal.price, manager: newAnimal.manager } });
  });

  User.findByIdAndUpdate(user.id, { $set: { cash: user.cash, inventory: user.inventory, lastLogout: user.lastLogout, farmname: user.farmname } })
    .then((results => {
      res.json(results);
    }))
    .catch(err => {
      console.error(err.message);
    });

  Promise.all(cropUpdatePromises.concat(animalUpdatePromises))
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err.message);
    })
});



module.exports = router;