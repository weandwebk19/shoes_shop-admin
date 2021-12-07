const express = require('express');
const router = express.Router();
const account_customerController = require('../components/controllers/Account_customerController');

router.get('/create', account_customerController.create);
router.post('/store', account_customerController.store);
router.get('/trash', account_customerController.trash);
router.get('/:id/edit', account_customerController.edit);
router.patch('/:id/restore', account_customerController.restore);
router.put('/:id', account_customerController.update);
router.delete('/:id', account_customerController.delete);
router.delete('/:id/force', account_customerController.force);

router.get('/', account_customerController.list);

module.exports = router;