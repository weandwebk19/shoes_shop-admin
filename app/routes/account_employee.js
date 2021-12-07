const express = require('express');
const router = express.Router();
const account_employeeController = require('../components/controllers/Account_employeeController');

router.get('/create', account_employeeController.create);
router.post('/store', account_employeeController.store);
router.get('/trash', account_employeeController.trash);
router.put('/:id', account_employeeController.update);
router.get('/:id/edit', account_employeeController.edit);
router.patch('/:id/restore', account_employeeController.restore);
router.delete('/:id', account_employeeController.delete);
router.delete('/:id/force', account_employeeController.force);

router.get('/', account_employeeController.list);

module.exports = router;