const mongoose = require('mongoose');
const createExtendedSchema = require('./common').createExtendedSchema;

module.exports = () => {
  const User = mongoose.model('User');
  const schema = createExtendedSchema();

  User.discriminator('Pupil', schema);
};
