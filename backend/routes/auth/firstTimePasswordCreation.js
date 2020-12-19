let User = require('../../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        if (req.body.password !== req.body.password2) return res.status(400).json({ message: 'Passwörter stimmen nicht überein' });
        const user = await User.findById(req.body._id)
        // Check if user has updated password yet, only valid for First time.
        if (user.status !== 'first_time') return res.status(400).json({
            message: 'Passwort bereits festgelegt... umleiten',
            email: user.email,
            redirect: true
        });
        user.status = 'active'
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) throw err;
                user.password = hash
                const updatedUser = await user.save()
                res.json({
                    message: 'Passwort erstellt',
                })
            });
        });

    } catch (err) {
        res.status(400).json({ message: 'Server Error' });
    }
}