var Model = function() {
	var self = this;
	this.roomIndex = {};
	this.rooms = ko.observableArray([]);
	this.selectedRoom = ko.observable({});

	this.selectRoom = function(index) {
		var room = self.rooms()[index];
		self.selectedRoom(room);
	};

	this.data = function(data) {
		var dataRoom = self.rooms()[0];
		dataRoom.messages.push(new Message(null, data));
	};

	this.didJoin = function(name) {
		var length = self.rooms().length;
		var room = new Chatroom(name, {
			shouldSelect:function() {
				self.selectRoom(length);
			}, isVisible:function() {
				return self.selectedRoom().name === this.name;
			}
		});

		self.roomIndex[name] = {
			index:length,
			value:room
		};

		self.rooms.push(room);
	};

	this.privmsg = function(roomname, nick, message) {
		var room = self.roomIndex[roomname].value;
		room.addMessage(nick, message);
	};

	var dataRoom = new Chatroom('output', {
		shouldSelect:function() {
			self.selectRoom(0);
		}, isVisible:function() {
			return self.selectedRoom().name === this.name;
		}
	});
	
	this.rooms.push(dataRoom);
	this.selectedRoom(dataRoom);
};