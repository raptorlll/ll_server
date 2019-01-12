const mongoose = require("mongoose");

function setBirthday(birthday) {
  if (birthday instanceof Date) {
    return birthday;
  }

  if (typeof birthday === "string") {
    return new Date(birthday);
  }

  return;
}

const commonUserSchema = {
  birthday: {
    type: Date,
    required: [true, "Fill birthday"],
    set: setBirthday,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Country',
    required:[true, 'Fill county'],
  },
  languages: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Language',
    required: [true, 'Fill languages'],
  }],
};

const userFields = ["email", "password"];
const commonFields = ["languages", "country", "birthday"];
const fieldsForUserType = {
  teacher: ["certificates", ...commonFields, ...userFields],
  pupil: [...commonFields, ...userFields],
}

const createExtendedSchema = (additionalParameters = {}) => {
  const options = {discriminatorKey: 'kind'};
  const schema = new mongoose.Schema({
    ...commonUserSchema,
    ...additionalParameters
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
  };

  return schema;
}

module.exports = {
  commonUserSchema,
  fieldsForUserType,
  createExtendedSchema
};
