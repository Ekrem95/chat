const mongoose = require('mongoose');
const User = require('./user');

module.exports = (io) => {
  mongoose.connect(process.env.mongo, { useMongoClient: true })
  .then(() => {
    let history = {};

    io.on('connection', (socket) => {
      console.log('Connected');

      io.to(socket.id).emit('id', socket.id);

      socket.on('message', message => {
        // console.log(message);
        const to = message.to;
        const id = history[to];

        // console.log(id);
        // io.sockets.emit('dist', message);
        socket.broadcast.to(id).emit('dist', message);

        // console.log(history);
      });

      socket.on('save id', obj => {
        const name = obj.user;
        history[name] = obj.id;

        // console.log(history);
      });
    });
  })
  .catch(err => {
    throw err;
  });
};
