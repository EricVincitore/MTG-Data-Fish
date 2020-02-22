var express = require("express");
var logger = require("morgan");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", handlebars({defaultLayout:"main"}));
app.set("view engine", "handlebars");

//if deployed, use yhe deployed database. Otherwise use hte local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds117888.mlab.com:17888/heroku_78c10xl3";

//connect to the mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var htmlRoutes = require("./routes/html-routes");
htmlRoutes(app);

app.listen(PORT, function () {
  console.log("App running on port " + "http://localhost:" + PORT);
});