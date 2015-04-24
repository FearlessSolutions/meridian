

var expect = chai.expect;

// expect = require('chai').expect;

describe("Cow", function() {
  describe("constructor", function() {

    it("should have a horse", function() {
      var horse = new Horse();
      expect(horse.watusi).to.equal("watusi");
      expect(horse.name).to.equal("Anon Horse");
    });


    it("should have a default name", function() {
      var cow = new Cow();
      expect(cow.name).to.equal("Anon cow");
    });

    it("should be populated with my dummy channel", function() {
      var toSend 


    });

  });


  });
