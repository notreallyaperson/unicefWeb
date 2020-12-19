const RssFeed = require('../../models/RssFeed');

module.exports = (req, res) => {
    const newRssFeed = new RssFeed({
        ...req.body,
        _id: req.body._id.replace(/https/g, 'http'),
    });
    newRssFeed
        .save()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => res.status(400).json('Error: ' + err));
}
