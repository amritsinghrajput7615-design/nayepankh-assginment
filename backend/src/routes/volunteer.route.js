const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunter.controller');
const { authenticateJWT } = require('../middileware/auth.middleware');
const { isAdmin } = require('../middileware/admin.middileware');

router.post('/create', volunteerController.createVolunteer);
router.post('/login', volunteerController.loginVolunteer);
router.get('/profile', authenticateJWT, volunteerController.getProfile);
router.put('/profile', authenticateJWT, volunteerController.updateProfile);
router.patch('/:id/status', authenticateJWT, isAdmin, volunteerController.updateVolunteerStatus);

module.exports = router;