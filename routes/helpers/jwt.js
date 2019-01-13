const jwt = require('express-jwt');
const mongoose = require("mongoose");
const jwtdecoder = require('jsonwebtoken');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const jwtHelper = {
  required: async (...arguments) => {
    const User = mongoose.model("User");
    const decoded = jwtdecoder.verify(getTokenFromHeaders(arguments[0]), "secret");

    const user = await User.findOne({_id: decoded.id});
    arguments[0].user = user;

    jwt({
      secret: 'secret',
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
    })(...arguments);
  },
  optional: (...arguments) => {
    return jwt({
      secret: 'secret',
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
      credentialsRequired: false,
    })(arguments)
  }
};

module.exports = jwtHelper;