'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
  name: {type: String, default: '', trim: true},
  description: {type: String, default: '', trim: true},
  code: {type: String, default: '', trim: true, unique: true},
  countries: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Country'}
  ],
});

LanguageSchema.path('name').required(true, 'Language name cannot be blank');
// LanguageSchema.path('description').required(true, 'Language description cannot be blank');
LanguageSchema.path('code').required(true, 'Language code cannot be blank');

module.exports = LanguageSchema;
