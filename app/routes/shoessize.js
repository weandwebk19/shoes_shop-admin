const express = require('express');
const router = express.Router();
const shoessizeController = require('../controllers/ShoessizeController');

router.get('/create', shoessizeController.create);
router.post('/store', shoessizeController.store);
router.get('/trash', shoessizeController.trash);
router.put('/:size/:id', shoessizeController.update);
router.get('/:size/:id/edit', shoessizeController.edit);
router.patch('/:size/:id/restore', shoessizeController.restore);
router.delete('/:size/:id', shoessizeController.delete);
router.delete('/:size/:id/force', shoessizeController.force);

router.get('/', shoessizeController.list);

module.exports = router;