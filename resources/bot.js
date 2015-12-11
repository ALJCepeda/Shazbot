require("../prototypes/string");
var _ = require("underscore");
var Promise = require("promise");
var IRC = require("./irc");
var Profile = require("./profile");
var commands = require("./commands");

var Bot = function() {
	this.nick = "";
	this.user = "Literphor";
	this.info = "NodeJS Bot";
	this.password = "";
	this.irc = "";
	this.isRegistered = false;
	this.anonymousUse = false;

	this.channels = [];
	this.commands = commands;
};

Bot.prototype.connect = function(nick, password, server, port) {
	return Bot.connect(this, nick, password, server, port);
};

Bot.prototype.changeUser = function(user, info) {
	return Bot.changeUser(this, user, info);
};

Bot.prototype.changeNick = function(nick, password) {
	return Bot.changeNick(this, nick, password);
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

Bot.prototype.outputTo = function(recipient) {
	return Bot.outputTo(this, recipient);
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

Bot.prototype.identify = function(password) {
	return Bot.identify(this, password);
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

	var args = str.split(" ");
	var prefix = "";
	var target = "";
	var cmd = "";

	if(args.length > 2) {
		target = args.shift();
		cmd = args.shift();

		if(cmd.indexOf("@") === 0) {
			prefix = cmd.slice(1, cmd.length);
			cmd = args.shift();
		}

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
	var promise = Promise.resolve("");

	if(info.valid === true) {
		if(bot.hasCommand(info.cmd) === true) {
			var response = 
		}
	}

	if(info.valid === true && (isLocal === true || bot.isTargeted(info.target) === true)) {
		if(bot.hasCommand(info.cmd) === true) {
			var response = bot.commandFor(info.cmd);
			promise = response.action(info.args, info.prefix);
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
		bot.changeUser(bot.user, bot.info);
		bot.changeNick(nick);

		irc.on("PING", function(entity, args) {
			bot.PING(entity, args);
		});

		irc.on("PRIVMSG", function(entity, args) {
			bot.PRIVMSG(entity, args);
			return true;
		});

		if(bot.isRegistered === true) {
			irc.on("NOTICE", function(entity, args) {
				var profile = new Profile(entity);

				if(profile.nick === "NickServ") {
					if(args[1].indexOf("registered") >= 0) {
						bot.identify(password);
					}

					if(args[1].indexOf("identified") >= 0) {
						bot.joinChannels();
					}
				}

				return true;
			});
		} else {
			irc.on_once("MODE", function(entity, args) {
				bot.joinChannels();
				return true;
			});
		}
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

Bot.exec = function(bot, str) {

}

Bot.outputTo = function(recipient) {
	return function(msg) {
		if(_.isArray(msg)) {
			msg.forEach(function(line) {
				bot.say(recipient, line);
			})
		} else if(msg !== ""){
			bot.say(recipient, msg);
		}
	};
};

Bot.error = function(error) {
	console.log(error);
	bot.say(recipient, "Internal error encountered");
};
Bot.PRIVMSG = function(bot, entity, args) {
	var profile = new Profile(entity);

	if(bot.anonymousUse === true || profile.isAdmin() === true) {
		var promise = bot.parse(args[1]) || "";

		var recipient = args[0] === bot.nick ? profile.nick : args[0];

		promise.then(bot.outputTo(recipient)).catch(bot.error);
	}
};

Bot.say = function(bot, target, message) {
	bot.irc.raw("PRIVMSG {0} :{1}".supplant([target, message]));
};

Bot.changeUser = function(bot, user, info) {
	bot.user = user;
	bot.info = info;
	bot.irc.raw("USER {0} 8 * :{1}".supplant([user, info]));
};

Bot.changeNick = function(bot, nick) {
	bot.nick = nick;
	bot.irc.raw("NICK " + nick);
};

Bot.identify = function(bot, password) {
	bot.password = password;
	bot.irc.raw("PRIVMSG NickServ :IDENTIFY " +password, true);
};

Bot.join = function(bot, channel) {
	bot.irc.raw("JOIN #{0}".supplant([channel]));
};

module.exports = Bot;