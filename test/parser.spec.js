const expect = require('chai').expect;
const parser = require('../services/parser');

describe("parser", function() {
  describe("return an object", function() {
    it("should have a command", function() {
      const str = "search chicken";
      const actual = parser(str).command;
      expect(actual).to.equal("search");
    });

    it("should have primary (given a primary arg)", function() {
      const str = "search chicken";
      const actual = parser(str).args.primary;
      expect(actual).to.equal("chicken");
    })
  })
});
