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
var bootstrap_socket = require("./resources/socket");


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

bootstrap_socket(io);

http.listen(8002, function() { console.log("listening on *:8001"); });