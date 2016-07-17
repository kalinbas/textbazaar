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
    return this.parsed;
  }

  extractCommand() {
    const endOfCommand = this.str.indexOf(' ')
    this.parsed.command = this.str.slice(0, endOfCommand)
    this.str = this.str.slice(endOfCommand + 1)
  }

  extractPrimary() {
    const firstParamIndex = this.str.search(this.reg);
    if (firstParamIndex === -1) {
      this.parsed.args.primary = this.str;
    }
    // else {}
    // if (firstParamIndex - 1 > 0) {
      // this.parsed.args.primary = this.str.slice(0, firstParamIndex - 1)
    // }
    // this.parsed.args.primary = firstParamIndex
  }
}


function parser(str) {

  const args = {
    primary: remainder
  }

  const match = reg.exec(remainder)
  if (match) {
    args[match[1]] = {
      comparison: match[2],
      value: match[3]
    }
  }

  return {
    command,
    args,
  }
}

module.exports = Parser;
