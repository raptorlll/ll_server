'use strict';

const mongoose = require('mongoose');
const LanguageSchema = require('./language');
const CountrySchema = require('./country');

module.exports = function () {
  mongoose.model('Language', LanguageSchema);
  mongoose.model('Country', CountrySchema);
};