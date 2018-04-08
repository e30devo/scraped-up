var express = require("express");
const exphbs = require('express-handlebars')
var bodyParser = require("body-parser");
var request = require("request");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");

var db = require("../models");
var app = express();

module.exports = function (app) {

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")


app.get("/", function (req, res) {
    db.Article.find({})
        .populate("comments")
        .then(function (storedResult) {
            const items = { storedResult }             
            res.render("index", items);
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

            $("article").each(function (i, element) {
                const headline = $(element).find(".headline").children().text();
                const url = $(element).find(".headline").children().attr("href");
                const summary = $(element).find(".excerpt").find("p").text();

                if (headline && !url.includes("deals.") && summary) {

                    db.Article.create({
                        headline: headline,
                        url: url,
                        summary: summary,
                    }).then(function (storedResult) {
                        return storedResult
                    }).catch(function (err) {
                        //if statement ignores "Duplicate entry error code: 11000".                
                        if (err.code == "11000") {
                            return
                        } else {
                            console.log(err.message);
                        }
                    });
                }
            });
        }
    }); res.send("Scrape Complete.")
});

app.post("/api/comment/:id", function (req, res) {
    const id = req.params.id;
    db.Comments.create(req.body)
        .then(function (result) {
            console.log(result);
            return db.Article.findOneAndUpdate({ _id: id }, { $push: { comments: result._id } }, { new: true });
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
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

}
