var config = require('../config');
var path = require("path");
var Emitter = require("./emitter");
var Obj = require(path.join(config.dirs.shared, "object", "obj.js"));

var SlashCommander = function() {
	Obj.assign(this, new Emitter())
};

Obj.assign(SlashCommander.prototype, Emitter.prototype, true);

SlashCommander.prototype.onNone = function() { };
SlashCommander.prototype.isValid = function(message) { 
	return message[0] === "/";
};

SlashCommander.prototype.parse = function(message) {
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

module.exports = SlashCommander;