var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;
var db = require("./models");

var app = express();

app.use(express.static("public"))
require("./routes/api-routes.js")(app);

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

mongoose.connect("mongodb://localhost/scraped-up");


