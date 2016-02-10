bootstrap_socketcmds = function(socket, bot, slasher) {
	socket.on('message', function(data) {
		var room = data.room;
		var message = data.message;

		var isValid = slasher.parse(message);
		if(isValid === false) {
			if(bot.isConnected === true) {
				bot.say(room, message);
				bot.respondTo(room, message);
			}
		}
	});

	socket.on("shouldLeaveRoom", function(name) {
		bot.leave(name);
	});

	socket.on("shouldJoinRoom", function(name) {
		bot.join(name);
	});
};

module.exports = bootstrap_socketcmds;