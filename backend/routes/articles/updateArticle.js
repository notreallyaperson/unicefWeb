const Article = require('../../models/Article');

module.exports = async (req, res) => {
    const { member_id, _id } = req.body
    try {
        const article = await Article.findByIdAndUpdate(req.body._id, req.body, { new: true })
        res.json(article)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}