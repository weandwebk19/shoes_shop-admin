const express = require('express');
const router = express.Router();
const customerController = require('../controllers/CustomerController');

router.get('/create', customerController.create);
router.post('/store', customerController.store);
router.get('/:id/edit', customerController.edit);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);
router.get('/', customerController.list);

module.exports = router;