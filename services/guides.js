function giveGuidance(topic) {
  switch(topic) {
    case "search":
      return (
`Search for a product
Params: seller, price, maxPages, location, tag
Ex: "search beef"
Ex: "search rice price<4"
Ex: "search seller=Moes maxPages=3"`
      )
    case "sell":
      return (
`List a new product or update an existing one
Max Chars: name=12 price=6 desciption=18
Ex: 'sell rice price=123 description="Golden Rice w VitA"'`
      )
    default:
      return (
`TextBazaar helps you buy and sell with your phone
Text "commands" for a list of commands, then use
"help <command>" to learn how to use it
Ex: "? search"`
      )
  }
}

module.exports = giveGuidance;
