const mongoose = require('mongoose');
const commonParameters = require('./common');

module.exports = () => {
  const options = {discriminatorKey: 'kind'};
  const User = mongoose.model('User');

  User.discriminator('Teacher', new mongoose.Schema({
    certificates: [mongoose.Schema.Types.Mixed],
    ...commonParameters,
  }, options));
}
