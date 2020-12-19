const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

// @route POST api/auth/login
// @desc Authorize the user
// @access Public
router.route('/login').post(require('./login'))

//@route GET Request api/auth/user
// @descr GET one user by their ID
// @access Private
router.route('/user').get(auth, require('./renewToken'))

//@route GET Request api/auth/user/create-password
// @descr GET one user by their ID
// @access Private
router.route('/create-password').post(require('./firstTimePasswordCreation'))

module.exports = router;