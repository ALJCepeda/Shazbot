var Bot = require("./bot");
var IRC = require("./irc");
var Profile = require("./profile");
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
		
		bootstrap_botcmds(bot, socket);
		bootstrap_slashercmds(slasher, bot, socket);
		bootstrap_socketcmds(socket, bot, slasher);

		bot.irc.data = function(data) {
			io.emit("data", data);
		};

		bot.channels = ["botwar"];
		bot.isRegistered = true;
	});
};

module.exports = bootstrap_socket;