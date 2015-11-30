require("../prototypes/string");
var _ = require("underscore");
var Promise = require("promise");
var IRC = require("./irc");
var Profile = require("./profile");
var commands = require("./commands");

var Bot = function() {
	this.nick;
	this.password;
	this.irc;
	this.isRegistered = false;

	this.channels = [];
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

Bot.prototype.joinChannels = function() {
	return Bot.joinChannels(this);
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
	var isValid = false;
	var prefix;

	var args = str.split(" ");
	var target = args.shift();
	var cmd = args.shift();

	if(cmd.indexOf("@") === 0) {
		prefix = cmd.slice(1, cmd.length);
		cmd = args.shift();
	}

	if(!_.isUndefined(target) && !_.isUndefined(cmd) && !_.isUndefined(args)) {
		isValid = true;
	}

	return {
		target:target,
		prefix:prefix,
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
	var promise;

	if(info.valid === true && bot.isTargeted(info.target) === true) {
		if(bot.hasCommand(info.cmd) === true) {
			var response = bot.commandFor(info.cmd);
			var prefix = !_.isUndefined(info.prefix) ? info.prefix + " " : "";
			promise = response.action(info.args, prefix);
		} else {
			promise = Promise.resolve("Unrecognized command: " + info.cmd);
		}
	}

	return promise;
};

Bot.connect = function(bot, nick, password, server, port) {
	irc = new IRC();
	bot.irc = irc;

	irc.connect(server, port, function() {
		bot.user("Literphor", "NodeJS Bot");
		bot.nick(nick, password);
		
		irc.on("PING", function(entity, args) {
			bot.PING(entity, args);
		});

		irc.on("PRIVMSG", function(entity, args) {
			bot.PRIVMSG(entity, args);
		});

		irc.on_once("MODE", function(entity, args) {
			bot.joinChannels();
		});
	});
};

Bot.joinChannels = function(bot) {
	bot.channels.forEach(function(channel) {
		bot.join(channel);
	});
}

Bot.PING = function(bot, entity, args) {
	bot.irc.raw('PONG :{0}'.supplant([args[1]]));
};

Bot.PRIVMSG = function(bot, entity, args) {
	var profile = new Profile(entity);

	if(profile.isAdmin()) {
		var promise = bot.parse(args[1]);

		if(!_.isUndefined(promise)) {
			var recipient = args[0] === bot.nick ? profile.nick : args[0];
			
			promise.then(function(result) {
				if(_.isArray(result)) {
					result.forEach(function(line) {
						bot.say(recipient, line);
					})
				} else {
					bot.say(recipient, result);
				}
			}).catch(function(error) {
				console.log(error);
				bot.say(recipient, "Internal error encountered");
			});
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

	if(this.isRegistered === true) {
		bot.irc.raw("PRIVMSG NickServ :IDENTIFY " +password, true);
	}
};

Bot.join = function(bot, channel) {
	bot.irc.raw("JOIN #{0}".supplant([channel]));
};

module.exports = Bot;