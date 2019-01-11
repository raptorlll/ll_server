const mongoose = require("mongoose");

const commonUserSchema = {
  birthday: Date,
  country: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Country'
  },
  languages: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Language'
  }],
};

module.exports = commonUserSchema;
