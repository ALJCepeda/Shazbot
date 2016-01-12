var Profile = require("../profile");
var Promise = require("promise");
var Dockerizer = require("/shared/dockerizer/dockerizer");

function uncurlQuotes(str) {
	var result = str.replace(/“|”/g, '"').replace(/‘|’/g, "'");
	return result;
}

bootstrap_botcmds = function(bot, socket) {
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

	bot.on("said", function(target, message) {
		socket.emit("output", { room:target, from:bot.nick, message:message });
	});

	bot.commands = {
		echo: {
			action: function(args, prefix) {
				var message = args.join(" ");
				var result = prefix + message;

				if(prefix !== "") {
					result = prefix + " " + result;
				}

				return Promise.resolve(result);
			}, alias: ["say"]
		},
		lgt: {
			action:function(args, prefix) {
				var query = args.join("+");
				var result = "{0}Lets google that! http://lmgtfy.com/?q={1}".supplant([prefix, query]);

				if(prefix !== "") {
					result = prefix + " " + result;
				}

				return Promise.resolve(result);
			}
		},
		php: {
			action:function(args, prefix) {
				var docker = new Dockerizer('/var/tmp/shazbot');
				var code = args.join(" ");

				code = uncurlQuotes(code);
				code = "<?php " + code;

				docker.stopAfter = 5000;
				return docker.execute(code, "php", "latest").then(function(data) {
					var result = data.stderr !== "" ? data.stderr : data.stdout;

					if(data.stderr !== "") {
						result = /^PHP (.*) in .*\n/g.exec(result);
						result.shift();
						result = result.join("\n");

						if(prefix !== "") {
							result = prefix + " " + result;
						}
					}
					
					return Promise.resolve(result);
				});
			}
		},
		nodejs: {
			action:function(args, prefix) {
				var docker = new Dockerizer('/var/tmp/shazbot');
				var code = args.join(" ");
				code = uncurlQuotes(code);

				docker.stopAfter = 5000;
				return docker.execute(code, "nodejs", "latest").then(function(data) {
					if(data.stderr !== "") {
						var error = data.stderr;

						var parts = error.split("\n").slice(1, 4)
						var before = parts[0].length;
						parts[0] = parts[0].replace(/.*{\s/, ""); //Error line with weird func call

						var diff = before - parts[0].length;
						parts[1] = parts[1].slice(diff, parts[1].length);

						if(prefix !== "") {
							parts = parts.map(function(part) {
								return prefix + " " + part;
							});
						}

						return Promise.resolve(parts);
					}
				
					return Promise.resolve(data.stdout);
				});
			}
		}
	};
};

module.exports = bootstrap_botcmds;