const mongoose = require("mongoose")
const path = require('path');
const spawn = require('child_process').spawn
require('dotenv').config()

const express = require('express');
const app = express()

//connect to MongoDB
const db = process.env.mongoURI;
mongoose
    .connect(
        db,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    )
    .then(() => {

        // Running Express
        app.use(express.json({ limit: '5mb' }));

        // Get routes to manipulate mongoDB (Database)
        require("./backend/routes")(app)

        //Serve Static Assets if we are in production
        if (process.env.NODE_ENV === 'production') {
            //set static folder
            app.use(express.static('frontend/build'));

            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
            });
        }

        app.get('/test', (req, res) => {
            var dataToSend;
            // spawn new child process to call the python script
            const python = spawn('python3', [__dirname + '/script.py'])
            // collect data from script
            python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                dataToSend = data.toString();
            });
            // in close event we are sure that stream from child process is closed
            python.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
                // send data to browser
                console.log(dataToSend)

                res.send(dataToSend)
            });
        })

        require('./migration')()
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`🚀 Server ready at http://localhost:${port}`)
        }
        )
    })
    .catch(err => console.log(err))
