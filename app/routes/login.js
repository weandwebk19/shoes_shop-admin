const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', {
    layout: null
  });
});

router.post('/',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',})
);

module.exports = router;

