'use strict';

const mongoose = require('mongoose');
const Message = mongoose.model('Message');

exports.create = async function (req, res, next) {
  const message = new Message({
    text: req.body.topic,
    sender: req.user._id,
    conversation: mongoose.Types.ObjectId(req.body.conversation),
  });

  try {
    const savedModel = await message.save();

    return res.status(201).json(savedModel);
  } catch (err) {
    console.log(err);
  }
};
