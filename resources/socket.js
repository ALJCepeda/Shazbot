var Bot = require("./bot");
var IRC = require("./irc");
var Slasher = require("./slasher");

var bootstrap_botcmds = require("./commands/bot");
var bootstrap_slashercmds = require("./commands/slash");
var bootstrap_socketcmds = require("./commands/socket");

var bootstrap_socket = function(io) {
	io.on('connection', function(socket) {
		console.log("User connected..");

		var irc = new IRC();
		var bot = new Bot(irc);
		var slasher = new Slasher();

		bot.channels = ["botwar"];
		
		bootstrap_botcmds(bot, socket);
		bootstrap_slashercmds(slasher, bot, socket);
		bootstrap_socketcmds(socket, bot, slasher);

		bot.irc.data = function(data) {
			io.emit("data", data);
		};
	});
};

module.exports = bootstrap_socket;