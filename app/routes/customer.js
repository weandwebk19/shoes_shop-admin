const express = require('express');
const router = express.Router();
const customerController = require('../components/controllers/CustomerController');

router.get('/create', customerController.create);
router.post('/store', customerController.store);
router.get('/trash', customerController.trash);
router.put('/:id', customerController.update);
router.get('/:id/edit', customerController.edit);
router.patch('/:id/restore', customerController.restore)
router.delete('/:id', customerController.delete);
router.delete('/:id/force', customerController.force);

router.get('/', customerController.list);

module.exports = router;