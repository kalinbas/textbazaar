search - "product name", [conditions]
notify - "product name", [conditions]
hours - "seller name", [date]

sell - "product name", "price", "desc (max 18 chars)"
update - "product name", "price", "desc (max 18 chars)"
remove - "product name"
setHours - startTime

----

# initial
TextBazaar guides you buy and sell with your phone
Text "commands" for a list of commands, then use
"guide <command>" to learn how to use it
Ex: "guide search"

# guide
Find out how to use a command, or param
Ex: "guide setAlert"
Ex: "guide search price"

# commands
For Everyone: guide, setLocation, setAlert, alerts, delAlert
For Buyers: search, desc
For Sellers: sell, list, remove, setName, setDesc

# guide setName
Set your username for people to find you
Maximum 12 characters.
Ex: "setName Moes"

# guide setLocation
Set your default location
Ex: "setLocation" NYC
You can always override your default location like so:
"search beef location=Afzalpur"

# guide search
Search for a product
Params: seller, price, maxPages, location, tag
Ex: "search beef"
Ex: "search rice price<4"
Ex: "search seller=Moes maxPages=3"

# guide alerts
See a list of your alerts and their IDs
May send multiple texts
See Also: setAlert, delAlert
Ex: "alerts"

# guide setAlert
Receive a text whenever a search would return a new result
Params: seller, price, location
Ex: "setAlert rice price<4"
Ex: "setAlert seller=Moes"

# held delAlert
Delete an alert with "delAlert <alert ID>"
To find your alert IDs text "alerts"
See Also: alerts, setAlert
Ex: "delAlert 3"
Ex: "delAlert all"

# guide desc
Receive a seller's description of their business
Ex: "desc Moes"

# guide setDesc
Set your business's description
153 Character Maximum
Ex: "setDesc Great food at great prices for 20 years. Open: Mon-Sat 09:00-22:00"

# guide sell
List a new product or update an existing one
Max Chars: name=12 price=6 desciption=18
Ex: 'sell rice price=123 description="Golden Rice w VitA"'

# guide remove
Remove a single or all products you sell
Ex: "remove rice"
Ex: "remove all"


# ERRORS
- "seller" param cannot be used with "price" or "location"
- "setAlert" command cannot be used with "maxPages" param
