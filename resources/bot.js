require("../prototypes/string");
var _ = require("underscore");
var Promise = require("promise");
var Profile = require("./profile");
var commands = require("./commands");

var Bot = function(irc) {
	this.nick = "";
	this.user = "Literphor";
	this.info = "NodeJS Bot";
	this.password = "";

	this.isConnected = false;
	this.isRegistered = false;
	this.anonymousUse = false;

	this.channels = [];
	this.commands = commands;
	this.listeners = {};
	this.irc = irc;
};

Bot.prototype.listen = function(cmd, cb, once) {
	if( _.isUndefined(this.listeners[cmd]) ) {
		this.listeners[cmd] = [];
	}

	this.listeners[cmd].push([cb, once]);
};

Bot.prototype.on = function(cmd, cb) {
	this.listen(cmd, cb, false);
};

Bot.prototype.once = function(cmd, cb) {
	this.listen(cmd, cb, true);
};

Bot.prototype.split = function(str) {
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

Bot.prototype.isTargeted = function(target) {
	if(target === "shaz") {
		return true;
	}

	return false;
};

Bot.prototype.hasCommand = function(cmd) {
	return !_.isUndefined(this.commands[cmd]);
};

Bot.prototype.commandFor = function(cmd) {
	return this.commands[cmd];
};

Bot.prototype.canRespond = function(info) {
	if(this.isTargeted(info.target) && this.hasCommand(info.cmd)) {
		return true;
	}

	return false;
};

Bot.prototype.parse = function(str) {
	var info = this.split(str);
	var promise = Promise.resolve("");

	if(info.valid === true && (isLocal === true || this.isTargeted(info.target) === true)) {
		if(this.hasCommand(info.cmd) === true) {
			var response = bot.commandFor(info.cmd);
			promise = response.action(info.args, info.prefix);
		} else {
			promise = Promise.resolve("Unrecognized command: " + info.cmd);
		}
	}

	return promise;
};

Bot.prototype.emit = function(cmd, entity, data) {
	var listeners = this.listeners[cmd];

	if(!_.isUndefined(listeners)) {
		this.listeners[cmd] = listeners.filter(function(entry) {
			entry[0](entity, data);
			return entry[1] === false;
		});
	}
};

Bot.prototype.connect = function(nick, password, server, port, complete) {
	var self = this;
	var irc = self.irc;
	console.log("Connecting to irc...");

	irc.connect(server, port, function() {
		self.changeUser(this.user, this.info);
		self.changeNick(nick);

		irc.on("PING", function(entity, args) {
			self.PING(entity, args);
		});

		irc.on("PRIVMSG", function(entity, args) {
			self.emit("privmsg", entity, args);
		});

		//353 is list of names in room
		irc.on("353", function(entity, args) {
			self.emit("nicknames", entity, args);
		});
		//366 is good for joining rooms
		irc.on("366", function(entity, args) {
			self.emit("joined", entity, args);
		});

		if(self.isRegistered === true) {
			irc.on("NOTICE", function(entity, args) {
				var profile = new Profile(entity);

				if(profile.nick === "NickServ") {
					if(args[1].indexOf("registered") >= 0) {
						self.identify(password);
					}

					if(args[1].indexOf("identified") >= 0) {
						self.joinChannels();
					}
				}

				return true;
			});
		} else {
			irc.on_once("MODE", function(entity, args) {
				self.joinChannels();
				return true;
			});
		}

		this.isConnected = true;
		complete();
	});
};

Bot.prototype.joinChannels = function() {
	this.channels.forEach(function(channel) {
		this.join(channel);
	}.bind(this));
};

Bot.prototype.PING = function(entity, args) {
	this.irc.raw('PONG :{0}'.supplant([args[1]]));
};

Bot.prototype.outputTo = function(recipient) {
	return function(msg) {
		if(_.isArray(msg)) {
			msg.forEach(function(line) {
				this.say(recipient, line);
			})
		} else if(msg !== ""){
			this.say(recipient, msg);
		}
	};
};

Bot.prototype.error = function(error) {
	console.log(error);
	this.say(recipient, "Internal error encountered");
};
Bot.prototype.PRIVMSG = function(entity, args) {
	var profile = new Profile(entity);

	if(this.anonymousUse === true || profile.isAdmin() === true) {
		var promise = this.parse(args[1]) || "";

		var recipient = args[0] === this.nick ? profile.nick : args[0];

		promise.then(this.outputTo(recipient)).catch(this.error);
	}
};

Bot.prototype.say = function(target, message) {
	this.irc.raw("PRIVMSG {0} :{1}".supplant([target, message]));
};

Bot.prototype.changeUser = function(user, info) {
	this.user = user;
	this.info = info;
	this.irc.raw("USER {0} 8 * :{1}".supplant([user, info]));
};

Bot.prototype.changeNick = function(nick) {
	this.nick = nick;
	this.irc.raw("NICK " + nick);
};

Bot.prototype.identify = function(password) {
	this.password = password;
	this.irc.raw("PRIVMSG NickServ :IDENTIFY " +password, true);
};

Bot.prototype.join = function(channel) {
	this.irc.raw("JOIN #{0}".supplant([channel]));
};

module.exports = Bot;