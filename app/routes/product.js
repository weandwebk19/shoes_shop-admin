const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

router.get('/create', productController.create);
router.post('/store', productController.store);

// Shoessize route
router.get('/shoessize/:size/:id/edit', productController.editShoessize);
router.put('/shoessize/:size/:id', productController.updateShoessize);
router.delete('/shoessize/:size/:id', productController.deleteShoessize);

// Product route
router.get('/:id/edit', productController.edit);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
router.get('/', productController.list);

module.exports = router;