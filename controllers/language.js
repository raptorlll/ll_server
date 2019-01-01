'use strict';

const mongoose = require('mongoose');
const async = require('co').wrap;
const Language = mongoose.model('Language');

exports.create = async(function* (req, res) {
  const language = new Language(req.body);

  try {
    yield language.save();

    return res.status(201).json();
  } catch (err) {
    console.log(err);
  }
});