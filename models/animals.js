'use strict'; 

const mongoose = require ('mongoose');

const animalsSchema = mongoose.Schema({
  type: String,
  count: Number,
  price: Number,  
  feed: String,
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  manager: Boolean
});

animalsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Animals', animalsSchema, 'Animals');