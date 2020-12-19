const RssFeed = require('../../models/RssFeed');

module.exports = async (req, res) => {
    const { _id } = req.body
    try {
        const rssfeed = await RssFeed.findByIdAndUpdate(req.body._id, req.body, { new: true })
        res.json(rssfeed)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}
