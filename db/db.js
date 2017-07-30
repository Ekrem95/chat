const mongoose = require('mongoose');
const User = require('./user');

module.exports = (io) => {
  mongoose.connect(process.env.mongo, { useMongoClient: true });

  // .then(() => {
  //   io.on('connection', (socket) => {
  //     console.log('Connected');
  //
  //     io.to(socket.id).emit('eko', socket.id);
  //
  //     socket.on('message', message => {
  //       console.log(message);
  //       io.sockets.emit('dist', message);
  //     });
  //   });
  // })
  // .catch(err => {
  //   throw err;
  // });
};
