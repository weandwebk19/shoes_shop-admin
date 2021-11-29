const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('register', {
    layout: null
  });
});

module.exports = router;