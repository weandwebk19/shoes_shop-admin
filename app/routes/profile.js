const express = require('express');
const router = express.Router();
const profileController = require('../components/controllers/ProfileController');

router.put('/info', profileController.updateInfo);
router.put('/account', profileController.updateAccount);
router.get('/change-password', profileController.changePassword);
router.put('/change-password', profileController.updatePassword);
router.get('/', profileController.show);

module.exports = router;