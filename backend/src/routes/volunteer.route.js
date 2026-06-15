const express = require('express');

const router = express.Router();

const volunteerController = require('../controllers/volunter.controller');

router.post('/create', volunteerController.createVolunteer);








module.exports = router;