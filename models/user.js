'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  farmname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  cash: Number,
  password: { type: String, required: true },
},
{
  'toJSON':{ virtuals: true },
  'toObject':{ virtuals: true}
});

userSchema.virtual('crops', {
  ref: 'Crops',
  localField: '_id',
  foreignField: 'user'
});

userSchema.set('toObject', {getters: true});

// userSchema.virtual('userAnimals', {
//   ref: 'Animals',
//   localField: '_id',
//   foreignField: 'user'
// });

// userSchema.set('toObject', {
//   transform: function (doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//     delete ret.password;
//   }
// });

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema, 'User');