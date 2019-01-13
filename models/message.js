const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
  text: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'Conversation is required'],
  },
});

mongoose.model("Message", schema);
