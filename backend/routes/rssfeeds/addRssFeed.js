const RssFeed = require('../../models/RssFeed');

module.exports = (req, res) => {
    const feedUrl = req.body.feedUrl.replace(/https/g, 'http');
    // Validation
    RssFeed.findOne({
      feedUrl,
    }).then( rssFeed => {
      if (rssFeed) {
        return res.status(400).json({ message: 'Feed already exists' });
      } else {
        const newRssFeed = new RssFeed({
          ...req.body,
          feedUrl: feedUrl,
        });
        newRssFeed
        .save()
        .then((rssFeed) => {
          res.json(rssFeed)
        })
        .catch((err) => res.status(400).json('Error: ' + err));
      }
    })
}
