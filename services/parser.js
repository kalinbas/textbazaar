class Parser {
  constructor(str) {
    this.str = str;
    this.reg = /(\w+)([=<>])(\w+|"[^"]*")/g;
    this.response = {
      args: {} 
    };
  }
  
  parse() {
    this.extractCommand();
    return this.response
  }

  extractCommand() {
    const endOfCommand = this.str.indexOf(' ')
    this.response.command = this.str.slice(0, endOfCommand)
    this.str = this.str.slice(endOfCommand + 1)
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
