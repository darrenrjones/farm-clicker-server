'use strict'; 

const mongoose = require ('mongoose');

const cropsSchema = mongoose.Schema({
  type: {type:String, unique:false},
  count: Number,
  total: Number,
  price: Number,
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
});

cropsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Crops', cropsSchema,'Crops');