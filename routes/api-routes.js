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
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.engine("handlebars", exphbs({ defaultLayout: "main" }))
    app.set("view engine", "handlebars")


    app.get("/", function (req, res) {
        db.Article.find().sort({ scrapedAt: -1 })
            .populate("comments").exec
            (function (err, storedResult) {                
                const message = { message: "There is no data here, click 'Get News!'" }
                if (!err && storedResult.length !== 0) {
                    const items = { storedResult }
                    res.render("index", items);
                } else
                    res.render("index", message)
                return err
            })
    });

    app.get("/api/data", function (req, res) {
        request("https://jalopnik.com/", function (error, response, html) {
            if (error) {
                res.send(error.errno)
                return error;
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
                        }, (function (err, storedResult) {
                            if (!err) {
                                console.log(storedResult._id);
                            } else
                                if (err.code !== 11000)
                                    console.log(err.errmsg);
                            return err
                        })
                        );
                    }
                })
            }
        })
        res.send("Get News Complete!");
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
                return err
            });
    });



    app.post("/api/save/:id", function (req, res) {
        const id = req.params.id;
        db.Article.findOneAndUpdate({ _id: id }, { saved: true })
            .then(function (result) {
                res.send("Saved!")
            })
            .catch(function (err) {
                console.log(err);
                res.json(err.errmsg);
                return err
            })
    })

    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).sort({scrapedAt: 1}).populate("comments").exec 
            (function (err, result) {
            if (!err && result.length !== 0) {
                const items = { result }
                res.render("saved", items);
            } else
                console.log(err);
            return err
        })
    })

}//module.exports

