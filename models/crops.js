'use strict'; 

const mongoose = require ('mongoose');

const cropsSchema = mongoose.Schema({
  type: String,
  count: Number,
  price: Number,
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  manager: Boolean
});

cropsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Crops', cropsSchema,'Crops');