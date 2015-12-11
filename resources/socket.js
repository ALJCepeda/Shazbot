var io = require('socket.io')(http);
var Bot = require("./bot");

var bootstrap_socket = function() {
	io.on('connection', function(socket) {
		var bot = new Bot();
		bot.channels = ["botzoo"];
		bot.isRegistered = true;

		socket.on('msg', function(msg) {

		});

		try {
			bot.connect("Shazbot", "gooman10", "chat.freenode.net", 6667);
			bot.irc.data(function(data) {
				socket.emit('data', data);
			});
		} catch(exception) {

		}
	});


};

module.exports = bootstrap_socket;