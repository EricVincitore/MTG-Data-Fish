var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var PORT = 3000;

// Require all models
var db = require("./models");

var app = express();

//if deployed, use yhe deployed database. Otherwise use hte local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds117888.mlab.com:17888/heroku_78c10xl3";

//connect to the mongo DB
mongoose.connect(MONGODB_URI);

app.get("/", function (req, res) {

});

app.get("/signup", function (req, res) {

});

app.get("/homepage", function (req, res) {
  axios.get("https://www.mtggoldfish.com/").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $(".article-tile").each(function (i, element) {

      var title = $(element).find(".stealth-link").text();
      var description = $(element).find(".article-tile-abstract").text();
      var link = $(element).find(".stealth-link").attr("href");

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        description: description,
        link: "https://www.mtggoldfish.com" + link
      });

      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
  });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});