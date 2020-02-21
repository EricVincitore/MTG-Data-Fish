var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");

var db = require("./../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("index", {});
    });


    app.get("/scrape", function (req, res) {
        axios.get("https://www.mtggoldfish.com/").then(function (response) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);

            // Select each element in the HTML body from which you want information.
            // NOTE: Cheerio selectors function similarly to jQuery's selectors,
            // but be sure to visit the package's npm page to see how it works
            $(".article-tile").each(function (i, element) {

                var result = {};

                result.img =  $(element).children(".article-tile-image").children(".card-title").children(".card-img-tile").attr("style");
                result.title = $(element).children(".article-tile-title").children(".stealth-link").text();
                result.description = $(element).children(".article-tile-abstract").text();
                result.link = "https://www.mtggoldfish.com" + $(element).children(".article-tile-title").children(".stealth-link").attr("href");

                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(result)
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });


            });
            res.send("Scrape Complete");
        });
    });

    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("comment")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/api/comments", function (req, res) {
        db.Comment.find({})
        .then(function (dbComment) {
            res.json(dbComment);
        })
        .catch(function (err) {
            res.json(err)
        });
    });

    app.delete("/api/comments/:id", function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        db.Comment.deleteOne({ _id: id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            console.log("Deleted")
        });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};