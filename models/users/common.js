const mongoose = require("mongoose");

const commonUserSchema = {
  birthday: {
    type: Date,
    required: [true, "Fill birthday"],
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
const commonFields = []//["languages", "country", "birthday"];
const fieldsForUserType = {
  teacher: ["certificates", ...commonFields, ...userFields],
  pupil: [...commonFields, ...userFields],
}

module.exports = {
  commonUserSchema,
  fieldsForUserType
};
