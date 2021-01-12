module.exports = function (app) {
    app.use('/api/auth', require('./auth'))
    app.use('/api/users', require('./users'))
    app.use('/api/articles', require('./articles'))
    app.use('/api/rssfeeds', require('./rssfeeds'))
    app.use('/api/logs', require('./logs'))
    app.use('/api/cron', require('./cron'))
}
