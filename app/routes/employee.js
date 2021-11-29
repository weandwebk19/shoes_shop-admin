const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');

router.get('/create', employeeController.create);
router.post('/store', employeeController.store);
router.get('/trash', employeeController.trash);
router.patch('/:id/restore', employeeController.restore)
router.get('/:id/edit', employeeController.edit);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);
router.delete('/:id/force', employeeController.force);

router.get('/', employeeController.list);

module.exports = router;