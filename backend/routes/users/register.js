const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

module.exports = (req, res) => {
    const { password, password2, email, permissionLevel } = req.body;
    if (!password || !password2 || !email) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    // Check validation
    if (password !== password2) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    // Backend validation
    User.findOne({
        email,
    }).then((user) => {
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;

                    const newUser = new User({
                        password: hash,
                        email,
                        permissionLevel: 'Admin',
                        status: 'active',
                    });
                    newUser
                        .save()
                        .then((user) => {
                            jwt.sign(
                                {
                                    id: user.id,
                                    email: user.email,
                                    permissionLevel: user.permissionLevel,
                                    status: user.status,
                                },
                                config.get('jwtSecret'),
                                { expiresIn: 7200 },
                                (err, token) => {
                                    if (err) throw err;
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
                        })
                        .catch((err) => console.log(err));
                });
            });
        }
    });
}