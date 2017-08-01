const express = require('express');
const router = express.Router();
const User = require('../db/user');

router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ username: req.user.username, id: req.user._id });
  } else {
    res.json({ user: null });
  }
});

router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    const data = filterUsers(users);
    res.send(data);
  });
});

router.get('/messages/', (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    res.send(user);
  });
});

router.get('/search-users/:name', (req, res) => {
  User.find({ username: { $regex: '.*' + req.params.name + '.*' } }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      let userList = [];
      users.map(user => {
        userList.push({ username: user.username, id: user._id });
      });
      res.send(userList);
    }
  });
});

router.post('/messages/get/:name', (req, res) => {
  User.findOne({ username: req.params.name }, (err, user) => {
    const messages = user.messages.filter(message => {
      const inludes = message.to === req.body.with || message.from === req.body.with;
      return inludes;
    });
    res.send({ username: user.username, messages: messages });
  });
});

router.get('/messageswith/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    res.send({ username: user.username });
  });
});

router.post('/messages/:name', (req, res) => {
  let message = req.body;
  const time = Date.now();

  const sender = Object.assign({}, message, { with: message.to, time: time });
  const receiver = Object.assign({}, message, { with: message.from, time: time });

  User.findOneAndUpdate({ username: sender.from },
  {
    $push: { messages: sender },

  }, { upsert: false }, function (err, doc) {
      if (err) console.log(err);
    });

  User.findOneAndUpdate({ username: receiver.to },
  {
    $push: { messages: receiver },

  }, { upsert: false }, function (err, doc) {
      if (err) console.log(err);
    });
});

router.post('/history/:name', (req, res) => {
  const name = req.params.name;

  User.findOneAndUpdate({ username: name }, {
    $addToSet: { history: req.body },
  }, { upsert: false }, function (err, doc) {
      if (err) console.log(err);
    });
});

router.get('/history/:name', (req, res) => {
  User.findOne({ username: req.params.name }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (!user) {
      res.send('No user found');
    } else {
      res.send(user.history);
    }

  });
});

let filterUsers = (users => {
  let arr = [];
  users.map(user => {
    arr.push({ username: user.username, id: user._id });
  });
  return arr;
});

module.exports = router;
