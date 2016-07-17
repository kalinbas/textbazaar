const expect = require('chai').expect;
const Parser = require('../services/parser');

describe("parser", function() {
  describe("return an object", function() {
    it("should extract a command", function() {
      const str = "search chicken";
      const parser = new Parser(str)
      const actual = parser.parse().command;
      expect(actual).to.equal("search");
    });

    it("should have primary (given a primary arg)", function() {
      const str = "search chicken";
      const parser = new Parser(str)
      const actual = parser.parse().args.primary;
      expect(actual).to.equal("chicken");
    })

    it("should not have a primary (if not given one)", function() {
      const str = "search seller=Moes";
      const actual = parser(str).args.primary;
      expect(actual).to.equal(undefined)
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
