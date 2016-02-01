var Chatroom = function(name, options) {
	var self = this;
	options = options || {};
	this.name = name;
	this.users = ko.observableArray([]);
	this.messages = ko.observableArray([]);
	this.unread = ko.observable(0);

	this.addMessage = function(nick, msg) {
		var message = new Message(nick, msg);
		self.messages.push(message);

		if(this.isVisible() === false) {
			this.unread(this.unread() + 1);
		}
	};

	if(options.shouldSelect) {
		this.shouldSelect = options.shouldSelect.bind(this);
	}

	if(options.isVisible) {
		var isVisible = options.isVisible.bind(this);
		this.isVisible = ko.computed(isVisible);
		this.isVisible.subscribe(function(value) {
			if(value === true) {
				self.unread(0);
			}
		});
	}
};