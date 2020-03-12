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
var gridfs = require('gridfs-stream');


const uploadController = require("./controllers/upload");

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

morgan.token("body", function (req, res) {
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

  if (req.query.minimal == "true") {
    Game.find()
      .select("name")
      .exec((err, games) => {
        if (err) res.status(500).send(err);
        res.send(games);
      });
  } else {
    Game.find().exec((err, games) => {
      if (err) res.status(500).send(err);
      res.send(games);
    });
  }
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

app.post("/upload", uploadController.uploadFile);

app.get('/file/:file', (req, res) => {
  var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'photos'
  });

  gridfsbucket.find({filename: req.params.file}).hasNext().then(() => {
    gridfsbucket.openDownloadStreamByName(req.params.file)
      .on('error', (err) => res.status(404).json(err))
      .pipe(res)
      .on('error', () => {
        console.log("Some error occurred in download:" + error);
        res.json(error);
      })
  }).catch(err => res.json(err))

});

  // const GridFSBucket = db.GridFSBucket;

  // const gfs = new GridFSBucket(db, {bucketName: 'photos'});

  // // Check if file
  // if (!file || file.length === 0) {
  //   return res.status(404).json({
  //     err: 'No file exists',
  //   })
  // }

  // // Check if image
  // if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
  //   // Read output to browser
  //   const readstream = gfs.createReadStream(file.filename)
  //   readstream.pipe(res)
  // } else {
  //   res.status(404).json({
  //     err: 'Not an image',
  //   })
  // }

// Starting both http & https servers
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log("HTTP Server running on port 3000");
});

if (process.env.NODE_ENV == "production") {
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

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });
}
