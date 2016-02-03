var User = function(nick) {
	this.nick = nick;
	this.rooms = [];
	this.messages = [];
	this.messagesRoom = {};
}

User.prototype.addRoom = function(name) { 
	this.rooms.push(name); 
	this.messagesRoom[name] = [];
};
User.prototype.removeRoom = function(name) { this.rooms.remove(name); };
User.prototype.getRooms = function() { return this.rooms; };
User.prototype.emptyRooms = function() { this.rooms = []; };

User.prototype.setNick = function(value) { this.nick = value; }
User.prototype.getNick = function() { return this.nick; };

User.prototype.addMessage = function(roomname, message) { 
	this.message.push(message);
	this.messageRoom[roomname].push(message); 
};
User.prototype.getMessages = function() { return this.message; }
