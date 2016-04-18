var Profile = require("../profile");
var Promise = require("promise");
var path = require("path");

var config = require("../../config");
var Dockerizer = require(path.join(config.dirs.shared, "dockerizer", "dockerizer"));

bootstrap_botcmds = function(bot, socket) {
	bot.on("joined", function(entity, args) {
		var profile = new Profile(entity);

		if(profile.nick === bot.nick) {
			socket.emit("joinRoom", { room:args[0] });
		} else {
			socket.emit("userJoined", { nick:profile.nick, room:args[0] });
		}
	});

	bot.on("parted", function(entity, args) {
		var profile = new Profile(entity);

		if(profile.nick === bot.nick) {
			socket.emit("leaveRoom", { room:args[0] });
		} else {
			socket.emit("userLeft", { nick:profile.nick, room:args[0] });
		}
	});

	bot.on("privmsg", function(entity, args) {
		var profile = new Profile(entity);

		if(args[0] === bot.nick) {
			socket.emit("whisper", { from:profile.nick, message:args[1] });
		} else {
			var message = args[1];
			var highlighted = message.toLowerCase().indexOf(bot.nick.toLowerCase()) !== -1;

			socket.emit("output", { room:args[0], from:profile.nick, message:message, highlighted:highlighted });
		}
	});

	bot.on("nicknames", function(entity, args) {
		var ent = args[0].match(/(.+) (=|\*) (.+)/);
		var user = ent[1];
		var room = ent[3];
		var nicks = args[1].split(" ");

		var data = { room:room, nicknames:nicks };
		
		socket.emit("nicknames", data) ;
	});

	bot.on("said", function(target, message) {
		socket.emit("output", { room:target, from:bot.nick, message:message });
	});

	bot.commands = {
		echo: {
			action: function(args, prefix) {
				var message = args.join(" ");
				var result = prefix + message;

				return Promise.resolve(result);
			}, 
			alias: ["say"]
		},
		aa: {
			action: function(args, prefix) {
				if(args[0] === "true") {
					bot.anonymousUse = true;
					return Promise.resolve("Anonymous use now allowed");
				} else if (args[0] === "false") {
					bot.anonymousUse = false;
					return Promise.resolve("Anonymous use now denied");
				}

				return Promise.resolve("No action taken");
			}
		},
		lgt: {
			action:function(args, prefix) {
				var query = args.join("+");
				var result = "{0}Lets google that! http://lmgtfy.com/?q={1}".supplant([prefix, query]);

				return Promise.resolve(result);
			}
		},
		php: {
			action:function(args, prefix) {
				var docker = new Dockerizer('/var/tmp/shazbot');
				var code = args.join(" ");

				code = "<?php " + code;

				docker.stopAfter = 5000;
				return docker.execute(code, "php", "latest").then(function(data) {
					var result = data.stderr !== "" ? data.stderr : data.stdout;

					if(data.stderr !== "") {
						result = /^PHP (.*) in .*$/g.exec(result);
						result.shift();
						result = result.join("\n");
					}
					
					return Promise.resolve(prefix + result);
				});
			}
		},
		nodejs: {
			action:function(args, prefix) {
				var docker = new Dockerizer('/var/tmp/shazbot');
				var code = args.join(" ");

				docker.stopAfter = 5000;
				return docker.execute(code, "nodejs", "latest").then(function(data) {
					var result = "";

					if(data.stderr !== "") {
						var error = data.stderr;

						var parts = error.split(/\\n|<\/br>/g).slice(1, 4)
						var before = parts[0].length;
						parts[0] = parts[0].replace(/.*{\s/, ""); //Error line with weird func call

						var diff = before - parts[0].length;
						parts[1] = parts[1].slice(diff, parts[1].length);

						if(prefix !== "") {
							parts = parts.map(function(part) {
								return prefix + " " + part;
							});
						}
						
						result = parts;
					} else {
						result = data.stdout.split("\n");

						if(result[result.length - 1] === "") {
							result = result.slice(0, -1);
						}

						if(result.length === 1) {
							result = result[0];
						}
					}
				
					return Promise.resolve(result);
				});
			}
		}
	};
};

module.exports = bootstrap_botcmds;