'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: {type: String, default: '', trim: true},
  flag: {type: String, default: '', trim: true},
  languages: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Country'}
  ]
});

CountrySchema.path('name').required(true, 'Member name cannot be blank');
CountrySchema.path('flag').required(true, 'Country flag cannot be blank');

module.exports = CountrySchema;
