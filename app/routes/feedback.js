const express = require('express');
const router = express.Router();
const feedbackController = require('../components/controllers/FeedbackController');

router.get('/trash', feedbackController.trash);
router.get('/:id/edit', feedbackController.edit);
router.put('/:id', feedbackController.update);
router.patch('/:id/restore', feedbackController.restore)
router.delete('/:id', feedbackController.delete);
router.delete('/:id/force', feedbackController.force);

router.get('/', feedbackController.list);

module.exports = router;