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

router.get('/messages/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    res.send({ username: user.username, messages: user.messages });
  });
});

router.post('/messages/:id', (req, res) => {
  const user = req.body.from;

  User.findOneAndUpdate({ username: user },
  {
    $push: { 'messages.history': req.body },

    // $set: { 'messages.with': req.body.to },

    // $push: {
    //   messages: {
    //     // with: req.body.to,
    //     history: req.body,
    //   },
    // },

  }, { upsert: false }, function (err, doc) {
      if (err) console.log(err);
    });

  User.findOneAndUpdate({ _id: req.params.id },
  {
    $push: { 'messages.history': req.body },

    // $set: { 'messages.with': req.body.to },

    // $push: {
    //   messages: {
    //     // with: req.body.from,
    //     history: req.body,
    //   },
    // },

  }, { upsert: false }, function (err, doc) {
      if (err) console.log(err);
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
