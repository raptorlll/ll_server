'use strict';

const mongoose = require('mongoose');
const async = require('co').wrap;
const Country = mongoose.model('Country');

exports.create = async(function* (req, res, next) {
  const country = new Country({
    name: req.body.name,
    flag: req.body.flag,
  });

  try {
    yield country.save();

    return res.status(201).json();
  } catch (err) {
    console.log(err);
  }
});