const express = require('express');
const router = express.Router();
const account_employeeController = require('../controllers/Account_employeeController');

router.get('/create', account_employeeController.create);
router.post('/store', account_employeeController.store);
router.get('/:id/edit', account_employeeController.edit);
router.put('/:id', account_employeeController.update);
router.delete('/:id', account_employeeController.delete);

router.get('/', account_employeeController.list);

module.exports = router;