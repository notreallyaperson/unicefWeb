const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const RssFeed = require('../../models/RssFeed');

// @route POST api/rssfeeds
// Create rssfeed
// public access
router.route('/').post(require('./addRssFeed'));

//@route GET Request api/rssfeeds
// @descr GET All rssfeeds
// @access Private
router.route('/').get((req, res) => {
    RssFeed.find()
        .select('-createdAt -updatedAt -__v')
        .then((rssfeeds) => res.json(rssfeeds))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/rssfeeds/frontend
// @descr GET All rssfeeds
// @access Private
router.route('/frontend').get((req, res) => {
    RssFeed.find()
        .select('-createdAt -updatedAt -__v bloomFilter')
        .then((rssfeeds) => res.json(rssfeeds))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route PATCH Request api/rssfeeds
// @descr update a rssfeed using their ID
// @access Private
router.route('/').patch(require('./updateRssFeed'));

//@route DELETE Request api/rssfeeds
// @descr delete a rssfeed using their ID
// @access Private
// router.route('/:id').delete(auth, isAdmin, (req, res) => {
//     RssFeed.findByIdAndDelete(req.params.id)
//         .then(() => res.json({ message: 'Deleted Successfully' }))
//         .catch((err) => res.status(400).json('Error: ' + err));
// });

//@route DELETE Request api/rssfeeds/all
// @descr delete all rssfeeds
// @access Private
router.route('/all').delete((req, res) => {
    RssFeed.deleteMany({})
        .then(() => res.json({ message: 'Deleted All Successfully' }))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/rssfeeds
// @descr find a rssfeed using their ID
// @access Private
router.route('/:id').get((req, res) => {
    RssFeed.findById(req.params.id)
        .select('-password')
        .then((rssfeed) => res.json(rssfeed))
        .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
