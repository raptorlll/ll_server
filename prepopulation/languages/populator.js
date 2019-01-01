const languages = require('./data.json');
const mongoose = require('mongoose');

const runMultiple = (languageModel) => {
  return Promise.all(Object.keys(languages).map(runPopulation(languageModel)))
};

const runPopulation = (languageModel) => (code) => {
  return new Promise((res, rej) => {
    const language = new languageModel({
      name: languages[code].name,
      code: code,
      description: languages[code].nativeName,
    });

    language.save((err) => {
      if (err) {
        console.warn("Saving error", err);
        rej(code);

        return;
      }

      console.log("Saved", code);
      res(code);
    })
  })
};

module.exports = () => {
  const Language = mongoose.model('Language');

  return runMultiple(Language);
};
