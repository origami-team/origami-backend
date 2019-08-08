const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')




const gameSchema = require('./models/game')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(morgan('combined'))

var mongoDB = 'mongodb://localhost/origami';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/games', (req, res) => {
    const Game = mongoose.model('Game', gameSchema);

    Game.find().exec((err, games) => {
        if (err) res.status(500).send(err)
        res.send(games)
    })
})

app.post('/game', (req, res) => {
    gameSchema
        .initNew(req.body)
        .then(savedGame => {
            res.send(`🎉 successfully saved ${savedGame.name}`)
        }).catch(err => res.status(500).send(err))
})

app.listen(3000, () => {
    console.log("Listening at :3000...");
});