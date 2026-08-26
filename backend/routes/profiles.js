const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/profile/:id', profileController.showProfile);

module.exports = router;
