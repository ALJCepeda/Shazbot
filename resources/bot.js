require("../prototypes/string");
var _ = require("underscore");
var IRC = require("./irc");
var Profile = require("./profile");
var commands = require("./commands");

var Bot = function() {
	this.nick;
	this.password;
	this.irc;

	this.commands = commands;
};

Bot.prototype.connect = function(nick, password, server, port) {
	return Bot.connect(this, nick, password, server, port);
};

Bot.prototype.user = function(user, info) {
	return Bot.user(this, user, info);
};

Bot.prototype.nick = function(nick, password) {
	return Bot.nick(this, nick, password);
};

Bot.prototype.join = function(channel) {
	return Bot.join(this, channel);
};

Bot.prototype.parse = function(str) {
	return Bot.parse(this, str);
};

Bot.prototype.split = function(str) {
	return Bot.split(this, str);
};

Bot.prototype.isTargeted = function(target) {
	return Bot.isTargeted(this, target);
};

Bot.prototype.hasCommand = function(cmd) {
	return Bot.hasCommand(this, cmd);
};

Bot.prototype.commandFor = function(cmd) {
	return Bot.commandFor(this, cmd);
};

Bot.prototype.canRespond = function(info) {
	return Bot.canRespond(this, info);
};

Bot.prototype.say = function(target, message) {
	return Bot.say(this, target, message);
};

Bot.prototype.PING = function(entity, args) {
	return Bot.PING(this, entity, args);
};

Bot.prototype.PRIVMSG = function(entity, args) {
	return Bot.PRIVMSG(this, entity, args);
};

Bot.split = function(bot, str) {
	var args = str.split(" ");
	var target = args.shift();
	var cmd = args.shift();
	var isValid = false;

	if(!_.isUndefined(target) && !_.isUndefined(cmd) && !_.isUndefined(args)) {
		isValid = true;
	}

	return {
		target:target,
		cmd:cmd,
		args:args,
		valid:isValid
	};
};

Bot.isTargeted = function(bot, target) {
	if(target === "shaz") {
		return true;
	}

	return false;
};

Bot.hasCommand = function(bot, cmd) {
	return !_.isUndefined(bot.commands[cmd]);
};

Bot.commandFor = function(bot, cmd) {
	return bot.commands[cmd];
};

Bot.canRespond = function(bot, info) {
	if(bot.isTargeted(info.target) && bot.hasCommand(info.cmd)) {
		return true;
	}

	return false;
};

Bot.parse = function(bot, str) {
	var info = bot.split(str);
	var result = "";
	
	if(info.valid === true && bot.canRespond(info) === true) {
		var response = bot.commandFor(info.cmd);
		result = response.action(info.args);
	}

	return result;
};

Bot.connect = function(bot, nick, password, server, port) {
	irc = new IRC();
	bot.irc = irc;

	irc.connect(server, port, function() {
		bot.user("Literphor", "NodeJS Bot");
		bot.nick(nick, password);
		bot.join("botzoo");

		irc.on("PING", function(entity, args) {
			bot.PING(entity, args);
		});

		irc.on("PRIVMSG", function(entity,args) {
			bot.PRIVMSG(entity, args);
		});
	});
};

Bot.PING = function(bot, entity, args) {
	bot.irc.raw('PONG :{0}'.supplant([args[1]]));
};

Bot.PRIVMSG = function(bot, entity, args) {
	var profile = new Profile(entity);
	if(profile.isAdmin()) {
		var result = bot.parse(args[1]);

		if(result !== "") {
			bot.say(args[0], result);
		}
	}
};

Bot.say = function(bot, target, message) {
	bot.irc.raw("PRIVMSG {0} :{1}".supplant([target, message]));
};

Bot.user = function(bot, user, info) {
	bot.irc.raw("USER {0} 8 * :{1}".supplant([user, info]));
};

Bot.nick = function(bot, nick, password) {
	bot.nick = nick;
	bot.password = password;
	bot.irc.raw("NICK " + nick);
	bot.irc.raw("PRIVMSG NickServ :IDENTIFY " +password, true);
};

Bot.join = function(bot, channel) {
	bot.irc.raw("JOIN #{0}".supplant([channel]));
};

module.exports = Bot;