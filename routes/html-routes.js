var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var app = express();

var db = require("./../models");

app.get("/", function (req, res) {
    res.send("Hello world");
});


app.get("/homepage", function (req, res) {
    axios.get("https://www.mtggoldfish.com/").then(function (response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $(".article-tile").each(function (i, element) {

            var title = $(element).find(".stealth-link").text();
            var description = $(element).find(".article-tile-abstract").text();
            var link = $(element).find(".stealth-link").attr("href");

            if (title && link) {
                // Insert the data in the scrapedData db
                db.Article.insert({
                    title: title,
                    description: description,
                    link: link
                },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            };
        });
    });
});