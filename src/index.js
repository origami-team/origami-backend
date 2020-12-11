const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const rfs = require("rotating-file-stream");
const http = require("http");
const compression = require("compression");
const helmet = require("helmet");
const passport = require("passport");
const cookieparser = require("cookie-parser");

const accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "..", "log"),
});

process.env["NODE_CONFIG_DIR"] = __dirname + "/config";
const config = require("config");

const app = express();
app.use(express.static(__dirname, { dotfiles: "allow" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(compression());
app.use(helmet());

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieparser());

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

const mongoHost = process.env.MONGO_HOST;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDB = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/origami`;

mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(`
  Available routes:

  method\t\turl\t\tdescription
  GET\t\t\t/game/all\tget all games
  GET\t\t\t/game/:id\tget game with id
  `);
});

const gameRouter = require("./routes/game");
const trackRouter = require("./routes/track");
const fileRouter = require("./routes/file");
const userRouter = require("./routes/user");

app.use("/game", gameRouter);
app.use("/track", trackRouter);
app.use("/file", fileRouter);
app.use("/user", userRouter);

// Starting both http & https servers
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log("HTTP Server running on port 3000");
});
