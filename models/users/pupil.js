const mongoose = require('mongoose');
const commonParameters = require('./common').commonUserSchema;

module.exports = () => {
  const options = {discriminatorKey: 'kind'};
  const User = mongoose.model('User');

  const PupilModel = User.discriminator('Pupil', new mongoose.Schema({
    ...commonParameters,
  }, options));

  PupilModel.schema.path('languages').validate(function(languages) {
    if(!languages){
      return false
    } else if (languages.length === 0){
      return false
    }

    return true;
  })
}