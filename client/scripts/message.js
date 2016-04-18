var Message = function(nick, message, highlight) {
	this.nick = nick;
	this.message = message;
	this.highlight = highlight;
};

Message.prototype.toString = function() {
	if(this.nick) {
		return this.nick + ": " + this.message;
	}

	return this.message;
};