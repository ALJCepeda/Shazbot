var _ = require("underscore");
var express = require("express");
var bodyparser = require("body-parser");
var app = express();
var server = require("server").Server(app);
var io = require("socket.io")(server);
var path = require("path");
var util = require("util");
var fs = require("fs");

var config = require("./config");

app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(config.dirs.root, "client")));

app.get("/", function(req, res){
	res.sendFile(path.join(__dirname, "/client/index.html"));
});

app.get("/lib/:name", function(req, res){
	var script = config.lib[req.params.name];
	if( typeof script !== "undefined" ) {
		//Remove extension from dependency name
		var name = req.params.name;
		name = name.substring(0, name.indexOf("."));

		//Check if dependency is mapped somewhere in the bower directory
		if( typeof config.libMap[name] !== "undefined" ) {
			name = config.libMap[name];
		}

		//Send file or exception
		res.sendFile(path.join(config.dirs.bower, name, script));
	} else {
		//No dependency by that name
		res.status("404").send("Not Found");
	}
});

var bootstrap_socket = require("./resources/socket");
bootstrap_socket(io);

server.listen(config.port, function() { console.log("listening on *:" + config.port); });
