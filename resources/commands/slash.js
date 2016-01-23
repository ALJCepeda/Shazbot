var bootstrap_slashercmds = function(slasher, bot, socket) {
	slasher.onNone = function(command, args) {
		var message = command + " " + args.join(" ");
		bot.irc.raw(message);
		socket.emit("data", message);
	};

	slasher.on("connect", function(args) {
		if(bot.isConnected === false) {
			try {
				var server = args[0];
				var nick = args[1];
				var password = args[2];

				if(typeof password !== "undefined") {
					bot.isRegistered = true;
				}

				if(args.length > 3) {
					bot.channels = args.slice(3, args.length);
				}

				bot.connect(nick, password, server, 6667, function() {
					socket.emit("connected");
				});
			} catch(exception) {
				throw exception;
			}
		}
	});
};

module.exports = bootstrap_slashercmds;