// Rest for a countries https://restcountries.eu/
const makeGetRequest = require('../../helpers/http').makeGetRequest;
const mongoose = require('mongoose');

const parseInformation = (languagesList, languageModel) => (data) => {
  const Country = mongoose.model('Country');
  const countriesParsed = JSON.parse(data);

  if (typeof countriesParsed.status !== "undefined" && countriesParsed.status === 404) {
    console.log("[Fetching error]", languageModel.code);

    return;
  }

  countriesParsed.map((parsedData) => {
    Country.findOne({name: parsedData.name})
      .exec((err, countryModelFetched) => {
        if (countryModelFetched || err) {
          return;
        }

        const countryModel = new Country({
          code: parsedData.topLevelDomain,
          name: parsedData.name,
          languages: parsedData.languages.map(a => a.name)
            .map(name => {
              return languagesList.find(language => language.name === name)
            })
            .filter(a => !!a)
            .map(a => a._id),
        });

        countryModel.save((err) => {
          if (err) {
            console.log("Error while saving countries", err);

            return;
          }

          countryModel.populate('languages', (err, countryModelPopulated) => {
            countryModelPopulated.languages.forEach((language) => {
              language.countries.push(countryModel._id);
              language.save((err) => {
                if (err) {
                  console.log("Error while saving language", err);

                  return;
                }
              });
            });
          });
        });
      });
  });
};

const handleError = (error) => {
  console.log("[Fetching error]", error)
};

const fetchCountriesInfo = () => {
  const Language = mongoose.model('Language');
  const Country = mongoose.model('Country');

  //Get rid off data
  Country.remove({}, (err) => {
    Language.find({}).populate()
      .exec((err, languagesList) => {
        languagesList.forEach((language) => {
          makeGetRequest(`https://restcountries.eu/rest/v2/lang/${language.code}`)
            .then(parseInformation(languagesList, language))
            .catch(handleError);
        });
      });
  });
};

module.exports = {fetchCountriesInfo};
