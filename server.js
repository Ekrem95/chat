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
const io = require('socket.io').listen(server, {pingTimeout: 50000});
const morgan = require('morgan');
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.load();
const db = require('./db/db');
db(io);

app.use(compression());
app.use(cors())
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
