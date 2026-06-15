const bcrypt = require('bcrypt');

const Admin = require('../models/admin.model');
const Volunteer = require('../models/volunteer.model');

const isAdmin = async (req, res, next) => {
    const { email } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error validating admin',
            error: error.message
        });
    }
};

module.exports = {
    isAdmin
};