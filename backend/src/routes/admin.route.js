const express = require('express');
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const { authenticateJWT } = require('../middileware/auth.middleware')
const { isAdmin } = require('../middileware/admin.middileware')

router.post('/register', adminController.createAdmin)
router.post('/login', adminController.loginAdmin)

router.get('/volunteers', authenticateJWT, isAdmin, adminController.getAllVolunteers)
router.get('/volunteers/:id', authenticateJWT, isAdmin, adminController.getVolunteerById)
router.delete('/volunteers/:id', authenticateJWT, isAdmin, adminController.deleteVolunteer)
router.post('/mail-volunteer', authenticateJWT, isAdmin, adminController.mailVolunteer)

module.exports = router