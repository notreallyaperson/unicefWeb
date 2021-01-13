const Log = require('../../models/Log');

module.exports = (req, res) => {
    const newLog = new Log({
        ...req.body
    });
    newLog
        .save()
        .then((log) => {
            res.json(log)
        })
        .catch((err) => res.status(400).json('Error: ' + err));
}
