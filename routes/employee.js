const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('employee', {
    activeEmployee: 'active',
    activeCategory: 'active',
  });
});

module.exports = router;