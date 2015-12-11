var _ = require("underscore");
var express = require('express');
var bodyparser = require("body-parser");
var app = express();
var http = require('http').Server(app);

var path = require("path");
var fs = require('fs');

var config = require('./config');

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(config.dirs.root, 'client')));

app.get('/', function(req, res){ 
	res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.get('/lib/:name', function(req, res){
	var script = config.lib[req.params.name];
	if( typeof script !== 'undefined' ) {
		//Remove extension from dependency name
		var name = req.params.name;
		name = name.substring(0, name.indexOf('.'));

		//Check if dependency is mapped somewhere in the bower directory
		if( typeof config.libMap[name] !== 'undefined' ) {
			name = config.libMap[name];
		}

		//Send file or exception
		res.sendFile(path.join(config.dirs.bower, name, script));
	} else {
		//No dependency by that name
		res.status('404').send('Not Found');
	}
});

//Server
http.listen(8001, function() { console.log('listening on *:8001'); });
app.use(express.static(__dirname + '/client'));

process.stdin.on('data', function (text) {
	var msg = util.inspect(text);
	if (msg === 'quit\n') {
		done();
	} else {
		msg = msg.replace(/'|\\n/g, "");
		var args = msg.split(" ");
		var recipient = "#" + args.shift();

		var cmd = "shaz " + args.join(" ");
		console.log(cmd);
		bot.parse(cmd).then(bot.outputTo(recipient)).catch(bot.error);
	}
});

function done() {
	console.log('Now that process.stdin is paused, there is nothing more to do.');
	process.exit();
}