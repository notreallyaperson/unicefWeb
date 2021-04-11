const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const Article = require('../../models/Article');

// @route POST api/articles
// Create Article
// public access
router.route('/').post(require('./addArticle'));

//@route GET Request api/articles
// @descr GET All articles
// @access Private
router.route('/').get((req, res) => {
  Article.find()
    .then((articles) => res.json(articles))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/articles/filters
// @descr GET filtered
// @access Private
router.route('/filters').post((req, res) => {
  if (req.body.filters) {
    Article.find({ "feedId": { "$in": req.body.filters } })
      .skip(req.query.page * 10)
      .limit(10)
      .then((articles) => res.json(articles))
      .catch((err) => res.status(400).json('Error: ' + err));
  } else {
    Article.find()
      .skip(req.query.page * 10)
      .limit(10)
      .then((articles) => res.json(articles))
      .catch((err) => res.status(400).json('Error: ' + err));
  }

});

//@route GET Request api/articles
// @descr GET All articles which flagged an error
// @access Private
router.route('/noContent').get((req, res) => {
  Article.find({ noContentFlag: true })
    .select('-password')
    .then((articles) => res.json(articles))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/articles/total
// @descr GET total articles === largest _id +1
// @access Private
router.route('/total').get((req, res) => {
  Article.findOne()
    .sort({ _id: -1 })
    .select('_id')
    .then((article) => {
      if (article) {
        res.json({ value: article._id + 1 });
      } else {
        res.json({ value: 0 });
      }
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

//@route GET Request api/articles/1000
// @descr GET 1000 latest articles
// @access Private
router.route('/1000/:id').get((req, res) => {
  Article.find({ _id: { $lt: req.params.id } })
    .sort({ _id: -1 })
    .select('_id title content feedId dateParsed')
    .limit(1000)
    .then((articles) => {
      if (articles) {
        res.json({ articles: articles });
      } else {
        res.json({ articles: null });
      }
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

//@route PATCH Request api/articles
// @descr update a article using their ID
// @access Private
router.route('/').patch(auth, isAdmin, require('./updateArticle'));

//@route DELETE Request api/articles
// @descr delete a article using their ID
// @access Private
// router.route('/:id').delete(auth, isAdmin, (req, res) => {
//     Article.findByIdAndDelete(req.params.id)
//         .then(() => res.json({ message: 'Deleted Successfully' }))
//         .catch((err) => res.status(400).json('Error: ' + err));
// });


//@route GET Request api/articles
// @descr find a article using their ID
// @access Private
router.route('/:id').get((req, res) => {
  Article.findById(req.params.id)
    .select('-password')
    .then((article) => res.json(article))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
