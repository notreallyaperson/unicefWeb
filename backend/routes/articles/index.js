const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const Article = require('../../models/Article');

// @route POST api/articles
// Create Article
// public access
router.route('/').post(auth, isAdmin, require('./addArticle'));

//@route GET Request api/articles
// @descr GET All articles
// @access Private
router.route('/').get(auth, isAdmin, (req, res) => {
    Article.find()
        .select('-password')
        .then((articles) => res.json(articles))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route PATCH Request api/articles
// @descr update a article using their ID
// @access Private
router.route('/').patch(auth, isAdmin, require('./updateArticle'));

//@route DELETE Request api/articles
// @descr delete a article using their ID
// @access Private
router.route('/:id').delete(auth, isAdmin, (req, res) => {
    Article.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Deleted Successfully' }))
        .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/articles
// @descr find a article using their ID
// @access Private
router.route('/:id').get(auth, (req, res) => {
    Article.findById(req.params.id)
        .select('-password')
        .then((article) => res.json(article))
        .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
