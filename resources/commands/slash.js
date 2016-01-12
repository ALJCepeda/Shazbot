var bootstrap_slashercmds = function(slasher, bot, socket) {
	slasher.onNone = function(command, args) {
		var message = command + " " + args.join(" ");
		bot.irc.raw(message);
		socket.emit("data", message);
	};

	slasher.on("connect", function(args) {
		if(bot.isConnected === false) {
			try {
				bot.connect(args[1], args[2], args[0], 6667, function() {
					socket.emit("connected");
				});
			} catch(exception) {
				throw exception;
			}
		}
	});
};

module.exports = bootstrap_slashercmds;