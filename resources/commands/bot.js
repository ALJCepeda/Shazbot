bootstrap_botcmds = function(bot, socket) {
	bot.on("joined", function(entity, args) {
		var info = args[0].split(" ");
		socket.emit("addRoom", { room:info[1] });
	});

	bot.on("privmsg", function(entity, args) {
		var profile = new Profile(entity);
		socket.emit("data", { room:args[0], from:profile.nick, message:args[1] });
	});

	bot.on("nicknames", function(entity, args) {
		var ent = entity.split(" = ");
		var user = ent[0];
		var room = ent[1];
		var nicks = args[1].split(" ");

		socket.emit("nicknames", { room:ent[1], nicknames:nicks });
	});
};

module.exports = bootstrap_botcmds;