const expect = require('chai').expect;
const parser = require('../services/parser');

describe("parser", function() {
  describe("return an object", function() {
    it("should have a command and args", function() {
      const str = "search chicken";
      const actual = parser(str).command;
      expect(actual).to.equal("search");
    });

    it("should have primary (given a primary arg)", function() {
      const str = "search chicken";
      const actual = parser(str).args.primary;
      expect(actual).to.equal("chicken");
    })


    it("should extract a param (given a param)", function() {
      const str = "search seller=Moes";
      const actual = parser(str).args.seller;
      const expected = {
        comparison: "=",
        value: "Moes"
      }
      expect(actual).to.deep.equal(expected)
    })
  })
});
