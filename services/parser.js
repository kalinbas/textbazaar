 "use strict";
class Parser {
  constructor(str) {
    this.str = str;
    this.reg = /(\w+)([=<>])(\w+|"[^"]*")/g;
    this.parsed = {
      args: {} 
    };
  }
  
  parse() {
    this.extractCommand();
    this.extractPrimary();
    this.extractParams();
    return this.parsed;
  }

  extractCommand() {
    const endOfCommand = this.str.indexOf(' ')    
    if (endOfCommand === -1) {
      this.parsed.command = this.str
      this.str = ""
    } 
    else {
      this.parsed.command = this.str.slice(0, endOfCommand)
      this.str = this.str.slice(endOfCommand + 1)
    }
  }

  extractPrimary() {
    const firstParamIndex = this.str.search(this.reg);
    if (firstParamIndex === -1) {
      this.parsed.args.primary = this.str;
      this.str = ""
    }
    else if (firstParamIndex > 0) {
      const primary = this.str.slice(0, firstParamIndex - 1)
      this.parsed.args.primary = primary
    }
  }

  extractParams() {
    let match
    while (match = this.reg.exec(this.str)) {
      if (match) {
        const value = match[3].replace(/"/g, '')

        this.parsed.args[match[1]] = {
          comparison: match[2],
          value
        }
      }
    }
  }
}

module.exports = Parser;
