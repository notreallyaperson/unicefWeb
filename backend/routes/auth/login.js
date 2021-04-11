const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let User = require('../../models/User');


module.exports = async (req, res) => {
    // to add form validation
    if (!req.body.password || !req.body.email) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const { password, email } = req.body;
    // Backend validation
    User.findOne({
        email,
    })
        .then((user) => {
            if (!user) return res.status(400).json({ message: 'Invalid Email' });
            // Validate password
            bcrypt.compare(password, user.password, (err, same) => {
                if (err) throw err;
                if (same) {
                    jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            permissionLevel: user.permissionLevel,
                            status: user.status,
                        },
                        process.env.jwtSecret,
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
                    return res.status(400).json({ message: 'Incorrect Password' });
                }
            });
        })
        .catch((err) => console.log(err));
}