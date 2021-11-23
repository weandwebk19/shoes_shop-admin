const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');

router.get('/create', employeeController.create);
router.post('/store', employeeController.store);
router.get('/:id/edit', employeeController.edit);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

router.get('/', employeeController.list);

module.exports = router;