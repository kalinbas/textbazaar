function parser(str) {
  const endOfCommand = str.indexOf(' ')
  const command = str.slice(0, endOfCommand)
  const remainder = str.slice(endOfCommand + 1)

  const args = {
    primary: remainder
  }

  const reg = /(\w+)([=<>])(\w+|"[^"]*")/g
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

module.exports = parser;
