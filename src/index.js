const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const rfs = require("rotating-file-stream");
const http = require("http");
const https = require("https");
const fs = require("fs");
const compression = require("compression");

const gameSchema = require("./models/game");
const trackSchema = require("./models/track");

const accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "..", "log")
});

const app = express();
app.use(express.static(__dirname, { dotfiles: "allow" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(compression());

// Certificate
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.origami.felixerdmann.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.origami.felixerdmann.com/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/api.origami.felixerdmann.com/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

// setup the logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :body ":referrer" ":user-agent"',
    { stream: accessLogStream }
  )
);

const mongoHost = process.env.NODE_ENV == "production" ? "mongo" : "localhost";
const mongoDB = `mongodb://${mongoHost}/origami`;

console.log(mongoDB);

mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/games", (req, res) => {
  const Game = mongoose.model("Game", gameSchema);

  Game.find().exec((err, games) => {
    if (err) res.status(500).send(err);
    res.send(games);
  });
});

app.get("/game/:id", (req, res) => {
  const Game = mongoose.model("Game", gameSchema);

  Game.find({ _id: req.params.id }).exec((err, games) => {
    if (err) res.status(500).send(err);
    res.send(games);
  });
});

app.post("/game", (req, res) => {
  gameSchema
    .initNew(req.body)
    .then(savedGame => {
      res.status(200).send(savedGame);
    })
    .catch(err => res.status(500).send(err));
});

app.get("/tracks", (req, res) => {
  const Track = mongoose.model("Track", trackSchema);

  Track.find().exec((err, games) => {
    if (err) res.status(500).send(err);
    res.send(games);
  });
});

app.get("/track/:id", (req, res) => {
  const Track = mongoose.model("Track", trackSchema);

  Track.find({ _id: req.params.id }).exec((err, games) => {
    if (err) res.status(500).send(err);
    res.send(games);
  });
});

app.post("/track", (req, res) => {
  trackSchema
    .initNew(req.body)
    .then(savedTrack => {
      res.status(200).send(savedTrack);
    })
    .catch(err => res.status(500).send(err));
});

/*
app.listen(80, '0.0.0.0', () => {
    console.log("Listening at :3000...");
});
*/

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
