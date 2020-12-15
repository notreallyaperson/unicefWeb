const config = require('config');
const jwt = require('jsonwebtoken');
let User = require('../../models/User');

module.exports = async (req, res) => {
    User
        .findById(req.user.id)
        .select('-password')
        .then((user) => {
            if ((new Date(req.user.exp * 1000) - new Date()) / 60000 < 60) {
                console.log('Renew')
                jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        permissionLevel: user.permissionLevel,
                        status: user.status,
                    },
                    config.get('jwtSecret'),
                    { expiresIn: 7200 },
                    async (err, token) => {
                        if (err) throw err;
                        user.token = token
                        await user.save()
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                email: user.email,
                                permissionLevel: user.permissionLevel,
                                status: user.status,
                            },
                        });
                    }
                );
            } else {
                res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        permissionLevel: user.permissionLevel,
                        status: user.status,
                    },
                });
            }
        })
        .catch((err) => res.status(400).json('Error: ' + err));
}