const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

module.exports = (req, res) => {
    const { email } = req.body;
    const password = process.env.password
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
                        ...req.body
                    });
                    newUser
                        .save()
                        .then((user) => {
                            delete user.password
                            res.json(user)
                        })
                        .catch((err) => res.status(400).json('Error: ' + err));
                });
            });
        }
    });
}