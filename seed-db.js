'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('./config');

const User = require('./models/user');
const Crops = require('./models/crops');
const Animals = require('./models/animals');

const seedUser = require('./seed/users');
const seedCrops = require('./seed/crops');
const seedAnimals = require('./seed/animals');

let userIds = [];

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
    seedAnimals.forEach((task,i) => task.user = userIds[i]);
    seedCrops.forEach((crop,i) => crop.user = userIds[i]);
    return Promise.all([
      Crops.insertMany(seedCrops),
      Crops.createIndexes(),
      Animals.insertMany(seedAnimals),
      Animals.createIndexes(),
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });