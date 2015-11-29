var assert = require("assert");
var should = require("should");

var Profile = require("../resources/profile");

describe("Profile", function() {
	describe("Creation", function() {
		it("should create an admin profile", function() {
			var entity = "Literphor!~alfred@209.237.92.139";
			var profile = new Profile(entity);

			profile.isAdmin().should.equal(true);
		});
	});
});