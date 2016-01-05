var Message = function(nick, message) {
	this.nick = nick;
	this.message = message;

	this.toString = function() {
		if(this.nick) {
			return this.nick + ": " + this.message;
		} else {
			return this.message;
		}
	}
}