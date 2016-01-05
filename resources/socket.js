var Bot = require("./bot");
var IRC = require("./irc");
var Profile = require("./profile");

var bootstrap_socket = function(io) {
	io.on('connection', function(socket) {
		console.log("User connected..");

		var irc = new IRC();
		irc.data = function(data) {
			io.emit("data", data);
		};

		var bot = new Bot(irc);
		bot.channels = ["botwar"];
		bot.isRegistered = true;

		bot.on("joined", function(entity, args) {
			var info = args[0].split(" ");
			socket.emit("addRoom", { room:info[1] });
		});

		bot.on("privmsg", function(entity, args) {
			var profile = new Profile(entity);
			socket.emit("output", { room:args[0], from:profile.nick, message:args[1] });
		});

		bot.on("nicknames", function(entity, args) {
			var ent = entity.split(" = ");
			var user = ent[0];
			var room = ent[1];
			var nicks = args[1].split(" ");

			socket.emit("nicknames", { room:ent[1], nicknames:nicks });
		});

		socket.on('message', function(data) {
			var room = data.room;
			var message = data.message;

			if(message[0] === "/") {
				message = message.slice(1, message.length);

				if(message === "connect" && bot.isConnected === false) {
					try {
						bot.connect("Shazbot", "gooman10", "chat.freenode.net", 6667, function() {
							console.log(irc.socket.address());	
						});
					} catch(exception) {
						throw exception;
					}
				} else if(bot.isConnected === true) {
					irc.raw(message);
					socket.emit("output", { room:"output", message:message });
				}
			} else if(bot.isConnected === true){
				bot.say(room, message);
				socket.emit("output", { room:room, from:bot.nick, message:message });
			}
		});
	});


};

module.exports = bootstrap_socket;