var _ = require("underscore");
var Bot = require("./resources/bot");

var bot = new Bot();
bot.channels = ["botzoo", "php"];
bot.connect("Shazbot", "gooman10", "irc.freenode.net", 6667);
