const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/SliderController');

router.get('/create', sliderController.create);
router.post('/store', sliderController.store);
router.get('/trash', sliderController.trash);
router.get('/:id/edit', sliderController.edit);
router.put('/:id', sliderController.update);
router.patch('/:id/restore', sliderController.restore)
router.delete('/:id', sliderController.delete);
router.delete('/:id/force', sliderController.force);

router.get('/', sliderController.list);

module.exports = router;