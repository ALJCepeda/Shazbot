var net = require("net");
var _ = require("underscore");

var IRC = function() {
	var self = this;
	this.socket = new net.Socket();
	this.listeners = {};
	this.encoding = "utf-8";
	this.noDelay = true;
	this.isConnected = false;

	this.socket.on('data', function (data) {
		data = data.split('\n');
		for (var i = 0; i < data.length; i++) {
			if (data[i] !== '') {
				self.handle(data[i].slice(0, -1));
			}
		}
	});
};

IRC.prototype.data = function(data) {
	console.log(data);
};

IRC.prototype.disconnect = function() {
	this.socket.end();
};

IRC.prototype.connect = function(host, port, cb) {
	this.socket.setEncoding("utf8");

	if(this.noDelay === true) {
		this.socket.setNoDelay();
	}
	this.socket.connect(port, host);

	this.socket.on("connect", function() {
		this.isConnected = true;

		setTimeout(function() {
			cb();
		}, 1000);
	}.bind(this));	

	this.socket.on("end", function() {
		console.log("IRC connection ended... ");

		this.isConnected = false;
	}.bind(this));
};

IRC.prototype.listen = function(cmd, cb, once) {
	if( _.isUndefined(this.listeners[cmd]) ) {
		this.listeners[cmd] = [];
	}

	this.listeners[cmd].push([cb, once]);
};

IRC.prototype.on = function(cmd, cb) {
	this.listen(cmd, cb, false);
};

IRC.prototype.on_once = function(cmd, cb) {
	this.listen(cmd, cb, true);
};

IRC.prototype.raw = function(data, squelch) {
	this.socket.write(data + '\n', 'ascii', function () {
		if(squelch !== true) {
			console.log('SENT -', data);
		}
	});
};

IRC.prototype.handle = function(data) {
	var i, info;

	info = /^(?:[:](\S+) )?(\S+)(?: (?!:)(.+?))?(?: [:](.+))?$/.exec(data);
	console.log(data);
	if (info) {
		var entity = info[1];
		var cmd = info[2];
		var args = info.slice(3, info.length);
		var listeners = this.listeners[cmd];

		if( !_.isUndefined(listeners) ) {
			this.listeners[cmd] = listeners.filter(function(entry) {
				entry[0](entity, args);
				return entry[1] === false;
			});
		} else {
			this.data(data);
		}
	}
};

IRC.prototype.join = function(chan, callback) {
	this.raw('JOIN ' + chan);
};

module.exports = IRC;