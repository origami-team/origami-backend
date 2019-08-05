const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')


const Game = require('./models/game')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

var mongoDB = 'mongodb://localhost/origami';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/game', (req, res) => {
    Game.find().exec((err, games) => {
        if (err) console.error(err);
        res.send(games)
    })
})

app.post('/game', (req, res) => {
    const newGame = new Game({
        name: req.body.name,
        description: req.body.description,
        author: req.body.author,
        timeLimit: req.body.timeLimit,
        waypoints: req.body.waypoints
    })
    newGame.save(err => {
        if (err) res.err(err);
        res.send(`🎉 successfully saved ${newGame.name}`)
    });
})

app.listen(3000, () => {
    console.log("Listening at :3000...");
});