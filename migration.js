const Article = require('./backend/models/Article')
const Lamda = require('./backend/models/Lamda')
const LdaModel = require('./backend/models/LdaModel')
const Log = require('./backend/models/Log')
const RssFeed = require('./backend/models/RssFeed')
const User = require('./backend/models/User')
const axios = require('axios')

module.exports = async () => {
    try {
        new Promise(async (resolve, reject) => {
            const articles = await Article.find()
            const count = articles.length
            console.log(count)
            async function migrateData(i) {
                if (i < count) {
                    if (i % 500 == 0) {
                        console.log((i / count) * 100 + '% completed')
                    }
                    await axios.post('http://localhost:5000/api/articles', articles[i])
                    i++
                    migrateData(i)
                } else {
                    console.log(`Saved ${count} articles`)
                    resolve()
                }
            }
            migrateData(0)

        })

        // new Promise(async (resolve, reject) => {
        //     const data = await RssFeed.find()
        //     const promises = data.map(async e => {
        //         await axios.post('http://localhost:5000/api/rssfeeds', e)
        //     })
        //     Promise.all(promises)
        //         .then(result => {
        //             console.log(`Saved ${result.length}`)
        //             resolve()
        //         })
        // })

        // new Promise(async (resolve, reject) => {
        //     const data = await Log.find()
        //     const promises = data.map(async e => {
        //         await axios.post('http://localhost:5000/api/logs', e)
        //     })
        //     Promise.all(promises)
        //         .then(result => {
        //             console.log(`Saved ${result.length}`)
        //             resolve()
        //         })
        // })

    } catch (err) {
        console.log(err.message ? err.message : err)
    }
}