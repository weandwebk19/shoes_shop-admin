const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('customer', {
    activeCustomer: 'active',
    activeCategory: 'active',
  });
});

module.exports = router;