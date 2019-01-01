'use strict';

const mongoose = require('mongoose');
const config = require('./config');
const schema = require('./models');

connect()
  .then(function () {
    mongoose.connection.dropDatabase()
      .then(() => {
        schema();
        process.exit(0);
      });
  })
  .catch(() => {
    process.exit(1);
  });

function connect() {
  var options = {server: {socketOptions: {keepAlive: 1}}};

  return mongoose.connect(config.db, options);
}
