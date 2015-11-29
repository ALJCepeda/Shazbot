var _ = require("underscore");

var profiles = {
	Literphor: {
		roles:{
			admin:true
		}
	}
};

function parseEntity(entity) {
	var nick = entity.slice(0, entity.indexOf("!"));
	var user = entity.slice(entity.indexOf("~")+1, entity.indexOf("@"));
	var host = entity.slice(entity.indexOf("@")+1, entity.length);

	return { nick:nick, user:user, host:host };
};

var Profile = function(entity) {
	var info = parseEntity(entity);
	this.nick = info.nick;
	this.user = info.user;
	this.host = info.host;

	this.roles = {};

	if(profiles[this.nick]) {
		this.roles = profiles[this.nick].roles;
	}
};

Profile.prototype.isAdmin = function() {
	return Profile.isAdmin(this);
}

Profile.isAdmin = function(profile) {
	return profile.roles.admin === true;
};

if(module) {
	module.exports = Profile;
}