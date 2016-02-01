var IRC = function() {
	var self = this;
	this.roomIndex = {};
	this.rooms = ko.observableArray([]);
	this.selectedRoom = ko.observable({});
	this.autoScroll = true;

	this.addRoom("data");
	this.selectRoom(0);

	this.selectedRoom.subscribe(function(value) {
		self.tryScroll();
	});

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

IRC.prototype.data = function(data) {
	this.output("data", null, data);
};

IRC.prototype.whisper = function(nick, message) {
	if(this.hasRoom(nick) === false) {
		this.addRoom(nick);
	}

	this.output(nick, nick, message);
}

IRC.prototype.output = function(roomname, nick, message) {
	var room = this.getRoom(roomname);
	room.addMessage(nick, message);

	if(this.selectedRoom().name === roomname) {
		this.tryScroll();
	}
};

IRC.prototype.tryScroll = function() {
	if(this.autoScroll === true) {
		document.getElementById("bottom").scrollIntoView();
	}
}