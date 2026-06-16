const jwt = require('jsonwebtoken');
const Volunteer = require('../models/volunteer.model');
const Admin = require('../models/admin.model');

const authenticateJWT = async (req, res, next) => {
    try {
        let token = null;

        // Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } 
        // Fallback to cookie if cookie-parser is used
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user in Volunteer first
        let user = await Volunteer.findById(decoded.id).select('-password');
        
        // If not a volunteer, check Admin
        if (!user) {
            user = await Admin.findById(decoded.id).select('-password');
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid or expired token', 
            error: error.message 
        });
    }
};

module.exports = {
    authenticateJWT
};
