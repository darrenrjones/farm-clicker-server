'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('./config');

const User = require('./models/user');
// const Crops = require('../models/crops');
// const Animals = require('../models/animals');

const seedUser = require('./seed/users');
// const seedCrops = require('../seed/crops');
// const seedAnimals = require('../seed/animals');

// let userIds = [];
// let cropsIds = [];
// let animalIds = [];

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
  // .then(([User]) => {
  //   User.forEach((user, i) => UserIds.push(user.id)); // push all UserId's to UserId's array for access
  //   seedAnimals.forEach((task,i) => task.UserId = UserIds[i]);
  //   seedRewards.forEach((reward,i) => reward.UserId = UserIds[i]);
  //   seedCrops.forEach((kid,i) => kid.UserId = UserIds[i]);
  //   return Promise.all([
  //     Crops.insertMany(seedCrops),
  //     Crops.createIndexes(),
  //     // Animals.insertMany(seedAnimals),
  //     // Animals.createIndexes(),
  //     Rewards.insertMany(seedRewards),
  //     Rewards.createIndexes()
  //   ]);
  // })
  // .then((result) => {

  //   result[2].forEach(reward => rewardIds.push(reward.id));
  //   return Crops.find()
  //     .then(results => {
  //       CropsIds = results.map(Crops => Crops.id);
  //     });
  // })  
  // .then(() => {
  //   seedAnimals.forEach((task,i) => task.CropsId = CropsIds[i]);
  //   return Promise.all([
  //     Animals.insertMany(seedAnimals),
  //     Animals.createIndexes()
  //   ]);
  // })
  // .then(() => {
  //   return Animals.find()
  //     .then(results => {
  //       taskIds = results.map(task => task.id);
  //     });
  // })

  // .then(() => {
  //   seedCrops.forEach((Crops,i) => Crops.Animals = [taskIds[i]]);
  //   return Crops.findOneAndUpdate({_id:CropsIds[0]},seedCrops[0]);
  // })    
  // .then(() => Crops.findOneAndUpdate({_id:CropsIds[1]},seedCrops[1]))
  // .then(() => Crops.findOneAndUpdate({_id:CropsIds[2]},seedCrops[2]))
  // .then(() => Crops.findOneAndUpdate({_id:CropsIds[3]},seedCrops[3]))

  // .then(() => {
  //   seedUser.forEach((User,i) => User.Crops = [CropsIds[i]]);
  //   return User.findOneAndUpdate({_id:UserIds[0]},seedUser[0]);
  // })    
  // .then(() => User.findOneAndUpdate({_id:UserIds[1]},seedUser[1]))
  // .then(() => User.findOneAndUpdate({_id:UserIds[2]},seedUser[2]))
  // .then(() => User.findOneAndUpdate({_id:UserIds[3]},seedUser[3]))
  // .then(() => User.findByIdAndUpdate(UserIds[0], {rewards: rewardIds[0]}))
  // .then(() => User.findByIdAndUpdate(UserIds[1], {rewards: rewardIds[1]}))
  // .then(() => User.findByIdAndUpdate(UserIds[2], {rewards: rewardIds[2]}))
  // .then(() => User.findByIdAndUpdate(UserIds[3], {rewards: rewardIds[3]}))

  // .then(() => Rewards.findByIdAndUpdate(rewardIds[0], {CropsId: CropsIds[0]}))
  // .then(() => Rewards.findByIdAndUpdate(rewardIds[1], {CropsId: CropsIds[1]}))
  // .then(() => Rewards.findByIdAndUpdate(rewardIds[2], {CropsId: CropsIds[2]}))
  // .then(() => Rewards.findByIdAndUpdate(rewardIds[3], {CropsId: CropsIds[3]}))

  // .then(() => Crops.findByIdAndUpdate(CropsIds[0], {rewards: [rewardIds[0]]}))
  // .then(() => Crops.findByIdAndUpdate(CropsIds[1], {rewards: [rewardIds[1]]}))
  // .then(() => Crops.findByIdAndUpdate(CropsIds[2], {rewards: [rewardIds[2]]}))
  // .then(() => Crops.findByIdAndUpdate(CropsIds[3], {rewards: [rewardIds[3]]}))



  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });