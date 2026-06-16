

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin role required.'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error validating admin role',
            error: error.message
        });
    }
};

module.exports = {
    isAdmin
};