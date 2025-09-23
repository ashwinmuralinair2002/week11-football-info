// routes/user.js
const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const Football = require('../models/Football');
const router = express.Router();

router.get('/home', ensureAuthenticated, async (req, res) => {
  const items = await Football.find().lean();
  res.render('home', { user: req.session.user, items });
});

module.exports = router;
