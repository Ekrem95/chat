const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const morgan = require('morgan');

let users = [];
let connections = [];

app.use(morgan('dev'));

server.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('%s user', connections.length);

  socket.on('disconnect', (data) => {
    // if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();

    connections.splice(connections.indexOf(socket), 1);
    console.log('%s user', connections.length);
  });

  socket.on('send message', (data) => {
    console.log(data);
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });

  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }
});
