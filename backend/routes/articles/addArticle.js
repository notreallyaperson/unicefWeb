const Article = require('../../models/Article');

module.exports = (req, res) => {
    const newArticle = new Article({
        ...req.body
    });
    newArticle
        .save()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => res.status(400).json('Error: ' + err));
}