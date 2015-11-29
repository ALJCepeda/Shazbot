var commands = {
	echo: {
		action: function(args, prefix) {
			var message = args.join(" ");
			return prefix + message;
		}
	},
	lgt: {
		action:function(args, prefix) {
			var query = args.join("+");
			return "{0}Let me google! http://lmgtfy.com/?q={1}".supplant([prefix, query]);
		}
	}
};

module.exports = commands;