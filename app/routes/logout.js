const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    req.logout();
<<<<<<< HEAD
    res.redirect('/login');
=======
    res.redirect('/');
>>>>>>> 1d37f491d84203b9cd1be91684b147b5c80e80f0
  });

module.exports =router;

