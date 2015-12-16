var net = require("net");
var _ = require("underscore");

var IRC = function() {
	var self = this;
	this.socket = new net.Socket();
	this.listeners = {};
	this.encoding = "utf-8";
	this.noDelay = true;

	this.socket.on('data', function (data) {
		data = data.split('\n');
		for (var i = 0; i < data.length; i++) {
			if (data[i] !== '') {
				self.handle(data[i].slice(0, -1));
			}
		}
	});
};

IRC.prototype.connect = function(host, port, cb) {
	return IRC.connect(this, host, port, cb);
};

IRC.prototype.listen = function(cmd, cb, once) {
	return IRC.listen(this, cmd, cb, once);
};

IRC.prototype.on = function(cmd, cb) {
	return IRC.on(this, cmd, cb);
};

IRC.prototype.on_once = function(cmd, cb) {
	return IRC.on_once(this, cmd, cb);
};

IRC.prototype.raw = function(data, squelch) {
	return IRC.raw(this, data, squelch);
};

IRC.prototype.handle = function(data) {
	return IRC.handle(this, data);
};

IRC.prototype.join = function(channel) {
	return IRC.join(this, channel);
};

IRC.prototype.data = function(data) {
	return IRC.data(this, data);
};

IRC.data = function(irc, data) {
	console.log(data);
};

IRC.connect = function(irc, host, port, cb) {
	irc.socket.setEncoding("utf8");

	if(this.noDelay === true) {
		irc.socket.setNoDelay();
	}
	irc.socket.connect(port, host);

	irc.socket.on("connect", function() {
		console.log("Established connection... ");
		setTimeout(function() {
			cb();
		}, 1000);
	});	
};

IRC.listen = function(irc, cmd, cb, once) {
	if( _.isUndefined(irc.listeners[cmd]) ) {
		irc.listeners[cmd] = [];
	}

	irc.listeners[cmd].push([cb, once]);
};

IRC.on = function(irc, cmd, cb) {
	irc.listen(cmd, cb, false);
};

IRC.on_once = function(irc, cmd, cb) {
	irc.listen(cmd, cb, true);
};

IRC.raw = function(irc, data, squelch) {
	irc.socket.write(data + '\n', 'ascii', function () {
		if(squelch !== true) {
			console.log('SENT -', data);
		}
	});
};

IRC.handle = function(irc, data) {
	var i, info;

	info = /^(?:[:](\S+) )?(\S+)(?: (?!:)(.+?))?(?: [:](.+))?$/.exec(data);
	if (info) {
		var entity = info[1];
		var cmd = info[2];
		var args = info.slice(3, info.length);
		var listeners = irc.listeners[cmd];

		if( !_.isUndefined(listeners) ) {
			irc.listeners[cmd] = listeners.filter(function(entry) {
				entry[0](entity, args);
				return entry[1] === false;
			});
		} else {
			irc.data(data);
		}
	}
};

IRC.join = function(irc, chan, callback) {
	irc.raw('JOIN ' + chan);
};

module.exports = IRC;