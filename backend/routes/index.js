module.exports = function (app) {
    app.use('/api/auth', require('./auth'))
    app.use('/api/users', require('./users'))
    app.use('/api/articles', require('./articles'))
    app.use('/api/rssfeeds', require('./rssfeeds'))
}
