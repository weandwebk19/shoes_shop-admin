const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', {
    layout: null,
    wrong: req.query.wrong
  });
});

router.post('/',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login?wrong',})
);

module.exports = router;
<<<<<<< HEAD
=======

>>>>>>> 1d37f491d84203b9cd1be91684b147b5c80e80f0
