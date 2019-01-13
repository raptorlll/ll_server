const mongoose = require("mongoose");
const listRequire = require("../helpers/model-validation").listRequire;

const Schema = mongoose.Schema;

const schema = new Schema({
  topic: {
    type: String,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Choose participants'],
      validate: {
        validator: listRequire
      }
    }
  ],
});

mongoose.model("Conversation", schema);
