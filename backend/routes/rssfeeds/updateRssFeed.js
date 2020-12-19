const RssFeed = require('../../models/RssFeed');

module.exports = async (req, res) => {
    try {
        const rssfeed = await RssFeed.findByIdAndUpdate(req.body._id, req.body, { new: false })
        res.json('Success')
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}
