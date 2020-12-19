const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const User = require('../../models/User');

// @route POST api/ldamodel/create
// Create LDA model
// Admin access
router.route('/create').post(auth, isAdmin, require('./createModel'));

module.exports = router;
