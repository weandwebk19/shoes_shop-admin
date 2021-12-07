const express = require('express');
const router = express.Router();
const profileController = require('../components/controllers/ProfileController');

router.put('/info/:id', profileController.updateInfo);
router.put('/account/:id', profileController.updateAccount);
router.get('/', profileController.show);

module.exports = router;