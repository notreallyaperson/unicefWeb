const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const Log = require('../../models/Log');

// @route POST api/logs
// Create Log
// @access private
router.route('/').post(require('./addLog'));

//@route GET Request api/articles
// @descr GET All Logs
// @access Private
router.route('/').get((req, res) => {
    Article.find()
        .then((logs) => res.json(logs))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/logs
// @descr GET All logs with the queried type
// @access Private
router.route('/type/:query').get((req, res) => {
    Article.find( { type: req.params.query } )
        .then((logs) => res.json(logs))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/logs
// @descr find a log using its ID
// @access Private
router.route('/id/:id').get((req, res) => {
    Article.findById(req.params.id)
        .select('-password')
        .then((article) => res.json(article))
        .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
