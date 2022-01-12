const express = require('express');
const router = express.Router();
const passwordController = require('../components/controllers/PasswordController');

router.get('/:id', passwordController.resetPassword);
router.post('/', passwordController.sendEmail);
router.put('/', passwordController.updatePassword);
router.get('/', passwordController.forgotPassword);

module.exports = router;