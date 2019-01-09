'use strict';

const mongoose = require('mongoose');
const LanguageSchema = require('./language');
const CountrySchema = require('./country');
const UserSchema = require('./user');

module.exports = function () {
  mongoose.model('Language', LanguageSchema);
  mongoose.model('Country', CountrySchema);
  mongoose.model('User', UserSchema);
};