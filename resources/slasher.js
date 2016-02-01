/*
	Browser side command handler
*/

var config = require('../config');
var path = require("path");

var Emitter = require(path.join(config.dirs.root, "prototypes", "emitter"));
var Obj = require(path.join(config.dirs.shared, "object", "obj"));

var Slasher = function() {
	Obj.assign(this, new Emitter());
};

Obj.assign(Slasher.prototype, Emitter.prototype, true);

Slasher.prototype.onNone = function() { };
Slasher.prototype.isValid = function(message) { 
	return message[0] === "/";
};

Slasher.prototype.parse = function(message) {
	if(this.isValid(message)) {
		var args = message.split(" ");

		var cmd = args.shift().slice(1);

		if(this.respondsTo(cmd)) {
			this.emit(cmd, args);	
		} else {
			this.onNone(cmd, args);
		}

		return true;
	}

	return false;
};

module.exports = Slasher;