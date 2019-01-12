const mongoose = require('mongoose');
const commonParameters = require('./common').commonUserSchema;

module.exports = () => {
  const options = {discriminatorKey: 'kind'};
  const User = mongoose.model('User');
  const schema = new mongoose.Schema({
    ...commonParameters,
  }, options);

  schema.path('languages').validate(function(languages) {
    if(!languages){
      return false
    } else if (languages.length === 0){
      return false
    }

    return true;
  });

  schema.methods.setCountry = function(country){
    return new Promise((res, rej) => {
      this.model('Country').findOne({code: `.${country}`}, (err, countryModel) => {
        if (err) {
          rej(err);

          return;
        }

        this.country = countryModel._id;

        res(this);
      })
    });
  }
  schema.methods.setLanguages = async function(languages){
    return new Promise(async (res, rej) => {
      let languageModels

      try {
        languageModels = await Promise.all(languages.map(language => this.model("Language").findOne({code: language})));
      } catch (e) {
        res();
      }

      languageModels.filter(a => !!a).forEach((language) => this.languages.push(language._id));

      res(this);
    });
  }

  User.discriminator('Pupil', schema);
};
