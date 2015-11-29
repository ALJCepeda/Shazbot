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
	});
});