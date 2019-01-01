'use strict';

const mongoose = require('mongoose');
const config = require('../config');
const schema = require('../models');
const languagePopulator = require('./languages/populator.js');

connect()
  .then(function () {
    schema();

    languagePopulator()
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
  })
  .catch(connect);


function connect() {
  var options = {server: {socketOptions: {keepAlive: 1}}};

  return mongoose.connect(config.db, options);
}
