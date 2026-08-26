const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const helpRequestController = require('../controllers/helpRequestController');

router.get('/help-requests/new', requireLogin, helpRequestController.showRequestForm);
router.post('/help-requests', requireLogin, helpRequestController.createRequest);

router.get('/my-requests', requireLogin, helpRequestController.showMyRequests);
router.post('/help-requests/:id/respond', requireLogin, helpRequestController.respondToRequest);

module.exports = router;
