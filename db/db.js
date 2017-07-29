const mongoose = require('mongoose');
const User = require('./user');

module.exports = (io) => {
  mongoose.connect('mongodb://localhost/chat', { useMongoClient: true })
    .then(db => {
      io.on('connection', (socket) => {
        console.log('Connected');
      });
    })
    .catch(err => {
      throw err;
    });
};
