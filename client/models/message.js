var Message = function(nick, message) {
	this.nick = nick;
	this.message = message;
};

Message.prototype.toString = function() {
	if(this.nick) {
		return this.nick + ": " + this.message;
	}

	return this.message;
};