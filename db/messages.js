const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Messages = mongoose.Schema({
  send: [],
  received: [],
});

module.exports = mongoose.model('Messages', Messages);
