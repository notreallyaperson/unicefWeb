
function isAdmin(req, res, next) {
    try {
        //verify user is Admin
        if (req.user.permissionLevel === 'Admin') {
            next();
        }
    } catch (e) {
        res.status(400).json({
            message: 'Admin Route',
        });
    }
}

module.exports = isAdmin;
