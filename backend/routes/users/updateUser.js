const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

module.exports = async (req, res) => {
    const { member_id, _id } = req.body
    try {
        // const checkUserId = await User.findOne({ member_id })
        // if (checkUserId && checkUserId._id !== _id) return res.status(400).json({ message: 'ID already exists' })
        const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
        res.json(user)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}