'use strict';

const mongoose = require('mongoose');
const Conversation = mongoose.model('Conversation');

exports.create = async function (req, res, next) {
  const conversation = new Conversation({
    topic: req.body.topic,
    participants: req.body.participants.map(mongoose.Types.ObjectId),
  });

  try {
    const savedModel = await conversation.save();

    return res.status(201).json(savedModel);
  } catch (err) {
    console.log(err);
  }
};
