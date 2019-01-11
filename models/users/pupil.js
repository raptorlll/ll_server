const mongoose = require('mongoose');
const commonParameters = require('./common');

module.exports = () => {
  const options = {discriminatorKey: 'kind'};
  const User = mongoose.model('User');

  User.discriminator('Pupil', new mongoose.Schema({
    certificates: {},
    ...commonParameters,
  }, options));
}