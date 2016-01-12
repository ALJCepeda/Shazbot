var Emitter = function() {
	this.listeners = {};
};

Emitter.prototype.respondsTo = function(command) {
	return this.listeners[command] && this.listeners[command].length > 0;
};

Emitter.prototype.listen = function(command, func, once) {
	if( _.isUndefined(this.listeners[command]) ) {
		this.listeners[command] = [];
	}

	this.listeners[command].push([func, once]);
};

Emitter.prototype.on = function(command, func) {
	this.listen(command, func, false);
};

Emitter.prototype.once = function(command, func) {
	this.listen(command, func, true);
};

Emitter.prototype.emit = function(command, entity, data) {
	var listeners = this.listeners[command];

	if(!_.isUndefined(listeners)) {
		this.listeners[cmd] = listeners.filter(function(entry) {
			entry[0](entity, data);
			return entry[1] === false;
		});
	}
};

module.exports = Emitter;