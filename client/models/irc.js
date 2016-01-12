var IRC = function() {
	var self = this;
	this.roomIndex = {};
	this.rooms = ko.observableArray([]);
	this.selectedRoom = ko.observable({});

	this.addRoom("output");
	this.selectRoom(0);
};

IRC.prototype.selectRoom = function(index) {
	var room = this.rooms()[index];
	this.selectedRoom(room);
};

IRC.prototype.addRoom = function(name) {
	var length = this.rooms().length;
	var room = new Chatroom(name, {
		shouldSelect:function() {
			this.selectRoom(length);
		}.bind(this), isVisible:function() {
			return this.selectedRoom().name === name;
		}.bind(this)
	});

	this.roomIndex[name] = {
		index:length,
		room:room
	};

	this.rooms.push(room);
};

IRC.prototype.hasRoom = function(name) {
	return typeof this.roomIndex[name] !== 'undefined';
}
IRC.prototype.getRoom = function(name) {
	if(this.hasRoom(name) === true) {
		return this.roomIndex[name].room;
	}

	return null;
}
IRC.prototype.leaveRoom = function(name) {
	var room = this.getRoom(name);

	if(room) {
		this.rooms.remove(room);
		delete this.roomIndex[name];
		return true;
	}

	return false;
};

IRC.prototype.output = function(roomname, nick, message) {
	var room = this.roomIndex[roomname].room;
	room.addMessage(nick, message);
};