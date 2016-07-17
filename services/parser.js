function parser(str) {
  const endOfCommand = str.indexOf(' ')
  const command = str.slice(0, endOfCommand)
  const remainder = str.slice(endOfCommand + 1)

  const args = {
    primary: remainder
  }

  return {
    command,
    args,
  }
}

module.exports = parser;
