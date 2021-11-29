const express = require('express');
const router = express.Router();
const customerController = require('../controllers/CustomerController');

router.get('/create', customerController.create);
router.post('/store', customerController.store);
router.get('/trash', customerController.trash);
router.patch('/:id/restore', customerController.restore)
router.get('/:id/edit', customerController.edit);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);
router.get('/', customerController.list);
router.delete('/:id/force', customerController.force);

module.exports = router;