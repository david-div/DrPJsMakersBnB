var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");
var db = mongojs("makersbnb", ["rooms"], ["users"]);
var signup = require("./routes/signup");
var index = require("./routes/index");
var rooms = require("./routes/rooms");
var users = require("./routes/users");
var session = require("express-session");

var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});
app.use(expressValidator());
app.use(session({ secret: "drpjs" }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", index);
app.use("/signup", signup);
app.use("/rooms", rooms);
app.use("/users", users);

var server = app.listen(1337, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("app running at http://%s:%s", host, port);
});
