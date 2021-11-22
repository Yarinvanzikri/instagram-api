const express = require('express');
const mongoose = require('mongoose');
const routes = require('./config/routes')
const env = require('./config/env/index')
const cors = require('cors')
const app = express();
const port = 4000;

app.use(cors()); // Allows us to get request from other domains. (npm i cors)
app.use(express.static('public'))
app.use(express.json());
app.use(routes);

mongoose.connect(env.mongoUrl)
    .then(listen)
    .catch(err => console.error(err))

function listen() {
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`)
    });
}