var commands = {
	echo: {
		action: function(args) {
			var message = args.join(" ");
			return message;
		}
	},
	lgt: {
		action:function(args) {
			var query = args.join("+");
			return "http://lmgtfy.com/?q=" + query;
		}
	}
};

module.exports = commands;