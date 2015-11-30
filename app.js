var _ = require("underscore");
var Bot = require("./resources/bot");

var bot = new Bot();
bot.channels = ["botzoo"];
bot.isRegistered = false;
try {
	bot.connect("Shazbot2", "gooman10", "irc.gimp.net", 6667);	
} catch(exception) {

}
