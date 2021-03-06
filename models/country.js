'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  code: {type: String, trim: true},
  name: {type: String, default: '', trim: true},
  flag: {type: String, default: '', trim: true},
  languages: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Language'}
  ]
});

CountrySchema.path('code').required(true, 'Code name cannot be blank');
CountrySchema.path('name').required(true, 'Member name cannot be blank');

mongoose.model('Country', CountrySchema);
