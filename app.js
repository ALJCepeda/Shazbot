var _ = require("underscore");
var express = require("express");
var bodyparser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var util = require("util");
var fs = require("fs");

var config = require("./config");

app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(config.dirs.root, "client")));
app.use(express.static(path.join(config.dirs.root, "bower_components")));

app.get("/", function(req, res){ 
	res.sendFile(path.join(__dirname, "/client/index.html"));
});

var bootstrap_socket = require("./resources/socket");
bootstrap_socket(io);

http.listen(config.port, function() { console.log("listening on *:" + config.port); });