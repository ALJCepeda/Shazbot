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
			socket.emit("joined", { room:info[1], entity:entity, args:args });
		});

		bot.on("privmsg", function(entity, args) {
			var profile = new Profile(entity);
			socket.emit("privmsg", { room:args[0], from:profile.nick, message:args[1] });
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
			var msg = data.message;

			if(msg[0] === "/") {
				msg = msg.slice(1, msg.length);

				if(msg === "connect") {
					try {
						bot.connect("Shazbot", "gooman10", "chat.freenode.net", 6667);	
					} catch(exception) {
						throw exception;
					}
				} else {
					irc.raw(msg);
				}
			} else {
				bot.say(msg);
			}
		});
	});


};

module.exports = bootstrap_socket;