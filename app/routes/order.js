const express = require('express');
const router = express.Router();
const orderController = require('../components/controllers/OrderController');

router.get('/create', orderController.create);
router.post('/store', orderController.store);
router.get('/trash', orderController.trash);
router.patch('/:id/restore', orderController.restore)
router.get('/:id/edit', orderController.edit);
router.get('/:id/invoice', orderController.invoice);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);
router.delete('/:id/force', orderController.force);

router.get('/', orderController.list);

module.exports = router;