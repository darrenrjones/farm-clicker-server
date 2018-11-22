'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  farmname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  cash: Number,
  password: { type: String, required: true },
  inventory: {
    wheat: {type: Number, default: 0},
    corn: {type: Number, default: 0},
    soy: {type: Number, default: 0},
    clover: {type: Number, default: 0},
    fishfood: {type: Number, default: 0},
    eggs: {type: Number, default: 0},
    bacon: {type: Number, default: 0},
    milk: {type: Number, default: 0},
    wool: {type: Number, default: 0},
    goatcheese: {type: Number, default: 0},
    fishfillet: {type: Number, default: 0}
  }, 
  lastLogout: {type: Number, default: null}
},
{
  'toJSON':{ 
    virtuals: true,
    transform: (doc, ret) => Object.assign(ret, { password: null }) // <-- hide password from JSON.stringify() output
  },
  'toObject':{ virtuals: true}
});

userSchema.virtual('crops', {
  ref: 'Crops',
  localField: '_id',
  foreignField: 'user'
});

userSchema.virtual('animals', {
  ref: 'Animals',
  localField: '_id',
  foreignField: 'user'
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema, 'User');