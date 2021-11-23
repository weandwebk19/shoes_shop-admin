const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.get('/create', orderController.create);
router.post('/store', orderController.store);
router.get('/:id/edit', orderController.edit);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);

router.get('/', orderController.list);

module.exports = router;