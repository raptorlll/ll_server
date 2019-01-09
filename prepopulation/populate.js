'use strict';

const mongoose = require('mongoose');
const config = require('../config');
const schema = require('../models');
const languagePopulator = require('./languages/populator.js');
const fetchCountriesInfo = require('./countries/populator.js').fetchCountriesInfo;
const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --part [value]', 'Choose part')
  .parse(process.argv);

connect()
  .then(function () {
    schema();

    switch (program.part) {
      case 'languages':
        languagePopulator()
          .then(() => {
            process.exit(0);
          })
          .catch(() => {
            process.exit(1);
          });

        break;
      case 'countries':
        fetchCountriesInfo()
          .then(() => {
            process.exit(0);
          })
          .catch(() => {
            process.exit(1);
          });

        break
    }
  })
  .catch((error) => {
    console.log("Connection error", error)
  });


function connect() {
  var options = {server: {socketOptions: {keepAlive: 1}}};

  return mongoose.connect(config.db, options);
}
