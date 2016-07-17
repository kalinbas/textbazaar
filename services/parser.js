function parser(str) {
  var command = str.slice(0, str.indexOf(' '))

  return {
    command,
  }
}

module.exports = parser;
