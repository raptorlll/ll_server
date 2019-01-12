const mongoose = require('mongoose');
const createExtendedSchema = require('./common').createExtendedSchema;

module.exports = () => {
  const User = mongoose.model('User');
  const schema = createExtendedSchema({
    certificates: [mongoose.Schema.Types.Mixed],
  });

  User.discriminator('Teacher', schema);
}
