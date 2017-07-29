const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const compression = require('compression');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const morgan = require('morgan');
const dotenv = require('dotenv');

const db = require('./db/db');
db(io);
dotenv.load();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'src/public')));

app.use(session({
    secret: process.env.secret,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: true,
    resave: false,
    maxAge: 14 * 24 * 3600000,
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/api', require('./router/api'));
app.use('/', require('./router/router'));

server.listen(process.env.PORT || 3000);

// io.on('connection', (socket) => {
//   console.log('eko');
// });

// io.on('connection', (socket) => {
//   let chat = db.collection('chats');
//
//   sendStatus = (s) => {
//     socket.emit('status', s);
//   };
//
//   chat.find().limit(100).sort({ _id: 1 }).toArray((err, res) => {
//     if (err) throw err;
//
//     socket.emit('output', res);
//   });
//
//   socket.on('input', (data) => {
//     let name = data.name;
//     let message = data.message;
//
//     if (name === '' || message === '') {
//       sendStatus('Please enter a name and message');
//     } else {
//       chat.insert({ name: name, message: message }, () => {
//         io.emit('output', [data]);
//
//         sendStatus({
//           message: 'Message sent',
//           clear: true,
//         });
//       });
//     }
//   });
//
//   socket.on('clear', (data) => {
//     chat.remove({}, () => {
//       socket.emit('Cleared');
//     });
//   });
// });
