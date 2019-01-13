const mongoose = require("mongoose");

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
        validator: function(items) {
          if(!items){
            return false
          } else if (items.length === 0){
            return false
          }

          return true;
        }
      }
    }
  ],
});

mongoose.model("Conversation", schema);
