var Chatroom = function(name, options) {
	var self = this;
	options = options || {};

	this.name = name;
	this.users = ko.observableArray([]);
	this.selectedUser = ko.observable("");
	this.messages = ko.observableArray([]);
	this.unread = ko.observable(0);
	this.showUsers = ko.observable(false);
	this.showClose = ko.observable(true);

	if(options.shouldSelect) {
		this.shouldSelect = options.shouldSelect.bind(this);
	}

	if(options.isVisible) {
		this.isVisible = ko.computed(options.isVisible.bind(this));
		this.isVisible.subscribe(function(value) {
			if(value === true) {
				self.unread(0);
			}
		});
	}

	this.whisper = function(nick) {
		console.log("Should whisper " + nick);
	};
};

Chatroom.prototype.addUser = function(nick, role) {
	this.users.push(nick);
};

Chatroom.prototype.removeUser = function(nick) {
	this.users.remove(nick);
};

Chatroom.prototype.addMessage = function(message) {
	this.messages.push(message);

	if(this.isVisible() === false) {
		this.unread(this.unread() + 1);
	}
};