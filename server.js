import { Mongoose } from "mongoose";
var express = require("express");
var mongoose = require("mongoose");

var PORT = 3000;

// Require all models
var db = require("./models");

var app = express();

//if deployed, use yhe deployed database. Otherwise use hte local mongoHeadlines database
var MONGOD_URI = process.env.MONGODB_URI || "mongodd://localhost/mongoHeadlines";

//connect to the mongo DB
mongoose.connect(MONGOD_URI);