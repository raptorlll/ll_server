// Rest for a countries https://restcountries.eu/
const makeGetRequest = require('../../helpers/http').makeGetRequest;
const mongoose = require('mongoose');

/**
 * Recursively save references into each table
 *
 * @param languagesList
 * @param languageModel
 * @returns {Function}
 */
const parseInformation = (languagesList, languageModel) => (data) => {
  return new Promise((res) => {
    const Country = mongoose.model('Country');
    const countriesParsed = JSON.parse(data);

    if (typeof countriesParsed.status !== "undefined" && countriesParsed.status === 404) {
      console.log("[Fetching error]", languageModel.code);
      res(languageModel.code);

      return;
    }

    if (!countriesParsed.length) {
      res(languageModel.code)

      return;
    }

    countriesParsed.map((parsedData) => {
      Country.findOne({name: parsedData.name})
        .exec((err, countryModelFetched) => {
          if (countryModelFetched || err) {
            res(languageModel.code);

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
              res(languageModel.code);

              return;
            }

            countryModel.populate('languages', (err, countryModelPopulated) => {
              countryModelPopulated.languages.forEach((language) => {
                language.countries.push(countryModel._id);
                language.save((err) => {
                  if (err) {
                    console.log("Error while saving language", err);
                    res(languageModel.code);

                    return;
                  }

                  res(languageModel.code);
                });
              });
            });
          });
        });
    });
  });
};

const handleError = (error) => {
  console.log("[Fetching error]", error);

  return error;
};

const fetchCountriesInfo = () => {
  const Language = mongoose.model('Language');
  const Country = mongoose.model('Country');

  //Get rid off data
  return new Promise((res) => {
    Country.remove({}, (err) => {
      Language.find({}).populate()
        .exec((err, languagesList) => {
          const onfulfilled = (result)=> {
            res(result)
          }

          Promise.all(
            languagesList.map((language) => {
              return makeGetRequest(`https://restcountries.eu/rest/v2/lang/${language.code}`)
                .then(parseInformation(languagesList, language))
                // .catch(handleError)
            })
          )
          .then(onfulfilled, onfulfilled);
      });
    });
  });
};

module.exports = {fetchCountriesInfo};
