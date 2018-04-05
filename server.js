var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");

var PORT = 3000;
var db = require("./models");
var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/scraped-up");

app.get("/", function (req, res) {
    db.Article.find({})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.get("/api/data", function (req, res) {
    request("https://jalopnik.com/", function (error, response, html) {

        if (error) {
            res.json(error.errno)
            return console.error(error);
        } else {
            var $ = cheerio.load(html);
            const results = [];
            $(".headline").each(function (i, element) {
                var headline = $(element).children().text();
                var url = $(element).children().attr("href");
                const summary = $(".excerpt").children().text();
                results.push({
                    headline: headline,
                    url: url,
                    summary: summary,

                });
            });
          
            res.json(results);
        }
    })
});

app.post("/api/save", function (req, res) {
    db.Article.create(req.body)
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            console.log(err);
            res.json(err.errmsg);
        })
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});