const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  messages: [{}],
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.saveUser = function (user, callback) {
  bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
          user.password = hash;
          user.save(callback);
        });
    });
};

module.exports.getUserByUsername = function (username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, function (err, isMatch) {
      if (err) throw err;
      callback(null, isMatch);
    });
};
