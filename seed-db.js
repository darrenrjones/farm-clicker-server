'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('./config');

const User = require('./models/user');
const Crops = require('./models/crops');
// const Animals = require('./models/animals');

const seedUser = require('./seed/users');
const seedCrops1 = require('./seed/crops1');
const seedCrops2 = require('./seed/crops2');
const seedCrops3 = require('./seed/crops3');

// const seedAnimals = require('./seed/animals');

let userIds = [];
let crop1Ids = [];
let crop2Ids = [];
let crop3Ids = [];


mongoose.connect(DATABASE_URL)
  .then(() => {
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    return Promise.all([
      Promise.all(seedUser.map(user => User.hashPassword(user.password))),
    ]);
  })
  .then((results) => {    
    seedUser.forEach((user, i) => {user.password = results[0][i];});

    return Promise.all([
      User.insertMany(seedUser),
      User.createIndexes(),      
    ]);
  })
  .then(([User]) => {    
    User.forEach((user, i) => userIds.push(user.id)); // push all UserId's to UserId's array for access
    // seedAnimals.forEach((animal,i) => animal.user = userIds[i]);

    seedCrops1.forEach((crop) => crop.user = userIds[0]);
    
    seedCrops2.forEach((crop) => crop.user = userIds[1]);

    seedCrops3.forEach((crop) => crop.user = userIds[2]);

    return Promise.all([
      Crops.insertMany(seedCrops1),
      Crops.createIndexes(),
      Crops.insertMany(seedCrops2),
      Crops.createIndexes(),
      Crops.insertMany(seedCrops3),
      Crops.createIndexes(),
      // Animals.insertMany(seedAnimals),
      // Animals.createIndexes(),
    ]);
  })
  .then(() => {
    return Crops.find({user:userIds[0]})
      .then(result => {
        crop1Ids = result.map(crop => crop.id);
      });
  })
  .then(() => {
    return Crops.find({user:userIds[1]})
      .then(result => {
        crop2Ids = result.map(crop => crop.id);
      });
  })
  .then(() => {
    return Crops.find({user:userIds[2]})
      .then(result => {
        crop3Ids = result.map(crop => crop.id);
      });
  })
  .then(() => User.findOneAndUpdate({_id:userIds[0], crops: crop1Ids}))
  .then(() => User.findOneAndUpdate({_id:userIds[1], crops: crop2Ids}))
  .then(() => User.findOneAndUpdate({_id:userIds[2], crops: crop3Ids}))

  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });