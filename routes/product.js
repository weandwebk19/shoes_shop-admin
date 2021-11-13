const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('product', { 
    activeProduct: 'active',
    activeCategory: 'active',
  });
});

module.exports = router;