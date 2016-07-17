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
      const parser = new Parser(str)
      const actual = parser.parse().args.primary;
      expect(actual).to.equal(undefined)
    })

    it("should extract a param (given a param)", function() {
      const str = "search seller=Moes";
      const parser = new Parser(str)
      const actual = parser.parse().args.seller;
      const expected = {
        comparison: "=",
        value: "Moes"
      }
      expect(actual).to.deep.equal(expected)
    })

    it("should extract multi-word params", function() {
      const str = 'search myKey="Multiple Words"';
      const parser = new Parser(str)
      const actual = parser.parse().args.myKey
      const expected = {
        comparison: "=",
        value: "Multiple Words"
      }
      expect(actual).to.deep.equal(expected)
    })

    it("should extract multiple params", function() {
      const str = "search one=foo two=bar"
      const parser = new Parser(str)
      const actual = parser.parse().args
      const expected = {
        one: { comparison: "=", value: "foo" },
        two: { comparison: "=", value: "bar" }
      }
      expect(actual).to.deep.equal(expected)
    })

    it("should extract a primary & multiple params", function() {
      const str = "search lol wut one=foo two=bar"
      const parser = new Parser(str)
      const actual = parser.parse().args
      const expected = {
        primary: "lol wut",
        one: { comparison: "=", value: "foo" },
        two: { comparison: "=", value: "bar" }
      }
      expect(actual).to.deep.equal(expected)
    })

  })
});
