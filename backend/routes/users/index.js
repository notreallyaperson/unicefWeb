const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const User = require('../../models/User');

// @route POST api/users/register
// Registration API
// public access
router.route('/register').post(require('./register'));

// @route POST api/users
// Create User
// public access
router.route('/').post(auth, isAdmin, require('./addUser'));

//@route GET Request api/users
// @descr GET All users
// @access Private
router.route('/').get(auth, isAdmin, (req, res) => {
    User.find()
        .select('-password')
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route PATCH Request api/users
// @descr update a user using their ID
// @access Private
router.route('/').patch(auth, isAdmin, require('./updateUser'));

//@route DELETE Request api/users
// @descr delete a user using their ID
// @access Private
router.route('/:id').delete(auth, isAdmin, (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Deleted Successfully' }))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/users
// @descr find a user using their ID
// @access Private
router.route('/:id').get(auth, (req, res) => {
    User.findById(req.params.id)
        .select('-password')
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
