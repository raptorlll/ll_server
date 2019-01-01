  'use strict';

  const express = require("express");
  const bodyParser = require("body-parser");
  const mongoose = require('mongoose');
  const config = require('./config');
  const schema = require('./models');
  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  connect()
    .then(function () {
      console.log('Mongodb connected');
    })
    .catch(connect);

  schema();
  require('./config/routes')(app);

  listen();

  function listen() {
    var server = app.listen(3000, function () {
      console.log("app running on port.", server.address().port);
    });
  }

  function connect() {
    var options = {server: {socketOptions: {keepAlive: 1}}};

    return mongoose.connect(config.db, options);
  }
