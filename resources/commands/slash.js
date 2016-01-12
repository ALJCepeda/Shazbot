var bootstrap_slashercmds = function(slasher, bot, socket) {
	slasher.onNone = function(command, args) {
		var message = args.join(" ");
		bot.irc.raw(command + " " + message);
		socket.emit("output", { room:"output", message:message });
	};

	slasher.on("connect", function(args) {
		if(bot.isConnected === false) {
			try {
				bot.connect(args[0], args[1], args[2], 6667, function() {
					socket.emit("connected");
				});
			} catch(exception) {
				throw exception;
			}
		}
	});
};

module.exports = bootstrap_slashercmds;