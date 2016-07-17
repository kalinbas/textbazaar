function getGuide(topic) {
  switch(topic) {
    case "":
      return (
`TextBazaar is the online marketplace that works without the internet.
Text "commands" for the list of commands, then use "learn <command>" to learn more
Ex: "learn search"`
      )
		case "learn":
      return (
`Learn how to use a command, text "learn <command>"
Ex: "learn setAlert"
Ex: "learn search price"`
      )
    case "commands":
      return (
`- For Buyers: search, viewSeller
- For Sellers: sell, list, remove, removeAll, setName, setDescription
- For both: learn, setLocation`
      )
    case "setName":
      return (
`Set your username for people to find you
Maximum 12 characters.
Ex: "setName Moes"`
      )
    case "setLocation":
      return (
`Set your default location
Ex: "setLocation" NYC
You can always change your default location
Ex: "search beef location=London"`
      )
		case "search":
      return (
`Search for a product
Ex: "search beef"
Ex: "search beef location=London"
Ex: "search rice price<4"
Ex: "search seller=Moes"`
      )
    case "viewSeller":
      return (
`View information on the Seller such as name, location, hours, etc. 
Ex: "description Moes, NYC, 09:00-22:00 "`
      )
    case "setDescription":
      return (
`Set your business description
Ex: "setDescription Great food at great prices for 20 years. Open: Mon-Sat 09:00-22:00"`
      )
    case "sell":
      return (
`List a new product or update an existing one
Ex: "sell rice price=123 description=Golden Rice with VitA"
Ex: "sell Cold Cuts price=456.78 description=Always kept on ice"`
      )
    case "remove":
      return (
`Remove a single product you sell
Ex: "remove rice"`
      )
    case "removeAll":
      return (
`Remove all products you sell
Ex: "remove all"`
      )
      default:
      return (
`There is no learn page for topic `+ topic
      )
			
  }
}


module.exports = getGuide;
