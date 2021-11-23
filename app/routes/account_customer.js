const express = require('express');
const router = express.Router();
const account_customerController = require('../controllers/Account_customerController');

router.get('/create', account_customerController.create);
router.post('/store', account_customerController.store);
router.get('/:id/edit', account_customerController.edit);
router.put('/:id', account_customerController.update);
router.delete('/:id', account_customerController.delete);

router.get('/', account_customerController.list);

module.exports = router;