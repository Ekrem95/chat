const express = require('express');
const router = express.Router();

router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ username: req.user.username, id: req.user._id });
  } else {
    res.json({ user: null });
  }
});

module.exports = router;
