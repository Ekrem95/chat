const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(server);
const morgan = require('morgan');

server.listen(process.env.PORT || 4000);

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/index.html');
});

mongo.connect('mongodb://localhost/chat', (err, db) => {
  if (err) throw err;

  console.log('Connected');

  client.on('connection', (socket) => {
    let chat = db.collection('chats');

    sendStatus = (s) => {
      socket.emit('status', s);
    };

    chat.find().limit(100).sort({ _id: 1 }).toArray((err, res) => {
      if (err) throw err;

      socket.emit('output', res);
    });

    socket.on('input', (data) => {
      let name = data.name;
      let message = data.message;

      if (name === '' || message === '') {
        sendStatus('Please enter a name and message');
      } else {
        chat.insert({ name: name, message: message }, () => {
          client.emit('output', [data]);

          sendStatus({
            message: 'Message sent',
            clear: true,
          });
        });
      }
    });

    socket.on('clear', (data) => {
      chat.remove({}, () => {
        socket.emit('Cleared');
      });
    });
  });
});
