var assert = require("assert");
var should = require("should");

var Bot = require("../resources/bot");
var bootstrap_botcmds = require("../resources/commands/bot");

describe("Profile", function() {
	describe("IRC Commands", function() {
		var bot = new Bot();
		bootstrap_botcmds(bot);

		it("echo", function(done) {
			bot.parse("shaz echo Hello World").then(function(result) {
				result.should.equal("Hello World");	
				done();
			}).catch(done);
		});

		it("echo with prefix", function(done) {			
			bot.parse("shaz @Literphor echo Hello World!").then(function(result) {
				result.should.equal("Literphor Hello World!");
				done();
			}).catch(done);
		});

		it("lgt", function(done) {
			bot.parse("shaz lgt Is pluto a planet?").then(function(result) {
				result.should.equal("Lets google that! http://lmgtfy.com/?q=Is+pluto+a+planet?");
				done();
			}).catch(done);
		});

		it("lgt with prefix", function(done) {
			bot.parse("shaz @Literphor lgt Is pluto a planet?").then(function(result) {
				result.should.equal("Literphor Lets google that! http://lmgtfy.com/?q=Is+pluto+a+planet?");
				done();	
			}).catch(done);
		});

		xit("php", function(done) {
			var bot = new Bot();

			bot.parse("shaz php $foo = 'bar'; echo $foo;").then(function(result) {
				result.should.equal("bar");
				done();
			}).catch(done);
		});

		xit("php error", function(done) {
			var bot = new Bot();

			bot.parse("shaz php echo $foo;").then(function(result) {
				result.should.equal("Notice:  Undefined variable: foo");
				done();
			}).catch(done);
		});

		xit("nodejs curly quotes", function(done) {
			var bot = new Bot();

			bot.parse("shaz nodejs var foo = “bar”; console.log(foo);").then(function(result) {
				result.should.equal("bar");
				done();
			}).catch(done);
		});

		xit("nodejs error", function(done) {
			var bot = new Bot();

			bot.parse('shaz nodejs var foo = bar"; consol.log("Hello"); console.log(foo);').then(function(result) {
				console.log(result);
			});
		});
	});
});