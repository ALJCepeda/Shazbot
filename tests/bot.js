var assert = require("assert");
var should = require("should");

var Bot = require("../resources/bot");

describe("Profile", function() {
	describe("IRC Commands", function() {
		it("echo", function() {
			var bot = new Bot();
			var result = bot.parse("shaz echo Hello World");
			
			result.should.equal("Hello World");
		});

		it("echo with prefix", function() {
			var bot = new Bot();
			var result = bot.parse("shaz @Literphor echo Hello World!");

			result.should.equal("Literphor Hello World!");
		});

		it("lgt", function() {
			var bot = new Bot();
			var result = bot.parse("shaz lgt Is pluto a planet?");

			result.should.equal("Let me google that for you! http://lmgtfy.com/?q=Is+pluto+a+planet?");
		});

		it("lgt with prefix", function() {
			var bot = new Bot();
			var result = bot.parse("shaz @Literphor lgt Is pluto a planet?");

			result.should.equal("Literphor Let me google that for you! http://lmgtfy.com/?q=Is+pluto+a+planet?");
		});
	});
});