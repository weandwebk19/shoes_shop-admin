const express = require('express');
const router = express.Router();
const productController = require('../components/controllers/ProductController');

router.get('/create', productController.create);
router.post('/store', productController.store);
router.get('/trash', productController.trash);
router.get('/:id/edit', productController.edit);
router.put('/:id', productController.update);
router.patch('/:id/restore', productController.restore)
router.delete('/:id', productController.delete);
router.delete('/:id/force', productController.force);

router.get('/', productController.list);

module.exports = router;