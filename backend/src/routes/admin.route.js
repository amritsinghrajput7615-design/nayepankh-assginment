const express = require('express');
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const { isAdmin } = require('../middileware/admin.middileware')

router.post('/register',adminController.createAdmin)
router.post('/login',adminController.loginAdmin)
router.get('/volunteers', isAdmin, adminController.getAllVolunteers)

router.post('/mail-volunteer', isAdmin, adminController.mailVolunteer)



module.exports = router