'use strict';

const main = require('../controllers/main');
const language = require('../controllers/language');
const country = require('../controllers/country');
const conversation = require('../controllers/conversation');
const message = require('../controllers/message');
const authRoutes = require('./auth')
const auth = require('./helpers/jwt');
const http = require('http');
const socket = require('socket.io');
const socketConnection = require('./socket');

const errorResponses = function (code, err) {
  switch (code) {
    case 422:
    case 500:
      return {error: err.stack};

    default:
      return {error: err.stack};
  }
};

module.exports = function (app) {
  app.get('/', main.index);
  app.post('/language', language.create);
  app.post('/country', country.create);
  app.post('/conversation', auth.required,conversation.create);
  app.post('/message', auth.required, message.create);
  authRoutes(app);

  app.use(function (err, req, res, next) {
    if (err) {
      return res.status(500).json(errorResponses(500, err));
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).json(errorResponses(422, err));
      return;
    }

    res.status(500).render(errorResponses(500, err));
  });

  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };

    return res.status(404).json(payload);
  });

  const io = socket(http.Server(app));

  socketConnection(io);
};
