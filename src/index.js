const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')

const gameSchema = require('./models/game')

const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '..', 'log')
})

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

// setup the logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :body ":referrer" ":user-agent"', { stream: accessLogStream }))

const mongoHost = process.env.NODE_ENV == 'production' ? 'mongo' : 'localhost'
const mongoDB = `mongodb://${mongoHost}/origami`;

console.log(mongoDB)

mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/games', (req, res) => {
    const Game = mongoose.model('Game', gameSchema);

    Game.find().exec((err, games) => {
        if (err) res.status(500).send(err)
        res.send(games)
    })
})

app.get('/game/:id', (req, res) => {
    const Game = mongoose.model('Game', gameSchema);

    Game.find({ _id: req.params.id }).exec((err, games) => {
        if (err) res.status(500).send(err)
        res.send(games)
    })
})

app.post('/game', (req, res) => {
    gameSchema
        .initNew(req.body)
        .then(savedGame => {
            res.status(200).send(`🎉 successfully saved ${savedGame.name}`)
        }).catch(err => res.status(500).send(err))
})


app.listen(3000, '0.0.0.0', () => {
    console.log("Listening at :3000...");
});