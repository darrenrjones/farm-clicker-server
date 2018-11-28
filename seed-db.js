'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('./config');

const User = require('./models/user');
const Crops = require('./models/crops');
const Animals = require('./models/animals');

const seedUser = require('./seed/users');

const seedCrops1 = require('./seed/crops1');
const seedCrops2 = require('./seed/crops2');
const seedCrops3 = require('./seed/crops3');

const seedAnimals1 = require('./seed/animals1');
const seedAnimals2 = require('./seed/animals2');
const seedAnimals3 = require('./seed/animals3');

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

    seedCrops1.forEach((crop) => crop.user = userIds[0]);
    
    seedCrops2.forEach((crop) => crop.user = userIds[1]);

    seedCrops3.forEach((crop) => crop.user = userIds[2]);

    seedAnimals1.forEach((animal) => animal.user = userIds[0]);
    
    seedAnimals2.forEach((animal) => animal.user = userIds[1]);

    seedAnimals3.forEach((animal) => animal.user = userIds[2]);

    return Promise.all([
      Crops.insertMany(seedCrops1),
      Crops.createIndexes(),
      Crops.insertMany(seedCrops2),
      Crops.createIndexes(),
      Crops.insertMany(seedCrops3),
      Crops.createIndexes(),
      Animals.insertMany(seedAnimals1),
      Animals.createIndexes(),
      Animals.insertMany(seedAnimals2),
      Animals.createIndexes(),
      Animals.insertMany(seedAnimals3),
      Animals.createIndexes(),
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });