// Rest for a countries https://restcountries.eu/
const https = require('https');
const makeGetRequest = require('../../helpers/http').makeGetRequest;
const mongoose = require('mongoose');

//
// var newArticle = new Article({
//   title: 'New Article',
//   authors: [userA._id, userB._id]
// })
// newArticle.save()
//
// Article.find({}).populate('authors').exec((err, articles) => {
//   console.log(articles)
// }); // Work fine as articles authors are pushed while saving the article
//
// User.find({}).populate('articles').exec((err, articles) => {
//   console.log(articles)
// }); // prints undefined
//
// User.find({'name': 'userA'}).populate('articles').exec((err, a) => {
//   console.log(a)
// }) // print []

const parseInformation = (data) => {
  const Country = mongoose.model('Country');
  const Language = mongoose.model('Language');

  Language.find({}).populate()
    .exec((err, languagesList) => {
      const countriesParsed = JSON.parse(data);

      countriesParsed.map((parsedData) => {
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

const fetchCountriesInfo = (language) => {
  makeGetRequest(`https://restcountries.eu/rest/v2/lang/${language}`)
    .then(parseInformation);
};

module.exports = {fetchCountriesInfo};
