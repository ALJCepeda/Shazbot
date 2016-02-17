var IRC = function() {
	var self = this;
	
	this.rooms = ko.observableArray([]);
	this.roomsIndex = {};

	this.selectedRoom = ko.observable({});
	this.autoScroll = true;

	var room = this.joinRoom("data");
	room.showClose(false);
	this.selectRoom("data");

	this.selectedRoom.subscribe(function(value) {
		self.tryScroll();
	});

	/*
		Toggles autoscroll based on user scroll action
		If user scrolls to bottom of page, autoscroll is enabled
		If user scrolls above bottom of page, autoscroll is disabled
		Throttled to 0.5 seconds
	*/
	var container = document.getElementById("content_container");
	var set_autoScroll = throttle(function() {
		var scrollOffset = container.scrollHeight - container.clientHeight;
	
		if(container.scrollTop === scrollOffset) {
			self.autoScroll = true;
		} else {
			self.autoScroll = false;
		}
	}, 500);
	container.onscroll = function() {
		set_autoScroll();
	};

	this.doLeaveRoom = function(room) {
		if(room.isWhisper === true) {
			self.removeRoom(room);
		} else {
			self.shouldLeaveRoom(room.name);
		}
	};

	this.doWhisper = function(nick) {
		var nick = self.strip(nick);
		var room = self.getRoom(nick);

		if(room === null) {
			room = self.joinRoom(nick);
			room.isWhisper = true;
		}

		irc.selectedRoom(room);
	};
};

IRC.prototype.strip = function(word) {
	if(["#","@"].indexOf(word[0]) !== -1) {
		return word.substring(1);
	}

	return word;
};

/*
	Selects room at index
*/
IRC.prototype.selectRoom = function(name) {
	var room = this.getRoom(name);

	if(this.selectedRoom() === room) {
		room.showUsers(!room.showUsers());
	} else {
		this.selectedRoom(room);
	}
};

/*
	Creates and adds empty Chatroom object with name
*/
IRC.prototype.joinRoom = function(name) {
	if(this.hasRoom(name)) {
		return this.getRoom(name);
	}

	var self = this;
	var length = this.rooms().length;

	var room = new Chatroom(name, {
		shouldSelect:function() {
			self.selectRoom(name);
			return true;
		}, isVisible:function() {
			return self.selectedRoom().name === name;
		}
	});

	this.rooms.push(room);
	this.roomsIndex[name] = length;

	return room;
};

/*
	Returns true if contains chat room with name
*/
IRC.prototype.hasRoom = function(name) {
	return typeof this.roomsIndex[name] !== 'undefined';
};

/*
	returns Chatroom object with name
*/
IRC.prototype.getRoom = function(name) {
	var room = null;

	if(this.hasRoom(name) === true) {
		var index = this.roomsIndex[name];
		room = this.rooms()[index];
	}

	return room;
};

/*
	Removes Chatroom object with name
	return true if successful
*/
IRC.prototype.leaveRoom = function(name){
	if(this.hasRoom(name) === true) {
		var room = this.getRoom(name);
		this.removeRoom(room);
	}
};

IRC.prototype.removeRoom = function(room) {
	this.rooms.remove(room);
	delete this.roomsIndex[room.name];
};

/*
	Adds array of nicknames to chat room
*/
IRC.prototype.nicknames = function(room, nicks) {
	nicks.forEach(function(nick) {
		this.userJoined(room, nick);
	}.bind(this));
};


IRC.prototype.userJoined = function(roomname, nickname) {
	var room = this.getRoom(roomname);
	room.addUser(nickname);
};

IRC.prototype.userLeft = function(roomname, nickname) {
	var room = this.getRoom(roomname);
	room.removeUser(nickname);
};

IRC.prototype.data = function(data) {
	this.output("data", null, data);
};

IRC.prototype.output = function(roomname, nick, msg, highlight) {
	if(this.hasRoom(roomname) === false) {
		return;
	}

	var room = this.getRoom(roomname);

	var message = new Message(nick, msg, highlight || false);
	room.addMessage(message);

	if(this.selectedRoom().name === roomname) {
		this.tryScroll();
	}
};

IRC.prototype.whisper = function(nick, message) {
	if(this.hasRoom(nick) === false) {
		this.joinRoom(nick);
	}

	this.output(nick, nick, message);
}

IRC.prototype.tryScroll = function() {
	if(this.autoScroll === true) {
		document.getElementById("bottom").scrollIntoView();
	}
};