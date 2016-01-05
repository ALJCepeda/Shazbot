var Chatroom = function(name, options) {
	var self = this;
	options = options || {};
	this.name = name;
	this.users = ko.observableArray([]);
	this.messages = ko.observableArray([]);

	this.addMessage = function(nick, msg) {
		var message = new Message(nick, msg);
		self.messages.push(message);
	};

	this.shouldSelect = function() {
		throw new Error("shouldSelect needs to be overwritten");
	};
	this.isVisible = function() {
		throw new Error("isVisible needs to be overwritten");
	};

	if(options.shouldSelect) {
		this.shouldSelect = options.shouldSelect.bind(this);
	}
	if(options.isVisible) {
		var isVisible = options.isVisible.bind(this);
		this.isVisible = ko.computed(isVisible);
	}
};