var express = require("express");
var mongoose = require("mongoose");

var PORT = 3000;

// Require all models
var db = require("./models");

var app = express();

//if deployed, use yhe deployed database. Otherwise use hte local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds117888.mlab.com:17888/heroku_78c10xl3";

//connect to the mongo DB
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});