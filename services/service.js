var Offer = require('../models/offer');
var User = require('../models/user');

var smsService = require('../services/smsService');

var NodeGeocoder = require('node-geocoder');

var Parser = require('./parser');
var guides = require('./guides');

function handle(message, number, callback) {
    // check if user exists - otherwise create
    User.findOne({ 'number': number }, function (err, user) {
        if (err) console.log(err);

        if (user) {
            handleSms(message, user, callback);
        } else {
            user = new User({ number: number, date: new Date() });
            user.save(function (err) {
                if (err) console.log(err);

                handleSms(message, user, callback);
            });
        }
    });
}

function handleSms(message, user, callback) {

    var parser = new Parser(message);
    var parsed = parser.parse();

    console.log(parsed);

    switch (parsed.command.toLowerCase()) {
        case "":
        case "?":
        case "learn":
            handleHelp(parsed.args.primary, user, callback);
            break;
        case "commands":
            handleCommands(user, callback);
            break;
        case "setlocation":
            handleSetLocation(parsed.args.primary, user, callback);
            break;
        case "setname":
            handleSetName(parsed.args.primary, user, callback);
            break;
        case "setdescription":
            handleSetDescription(parsed.args.primary, user, callback);
            break;
        case "sell":
            handleSell(parsed, user, callback);
            break;
        case "list":
            handleList(user, callback);
            break;
        case "remove":
            handleRemove(parsed.args.primary, user, callback);
            break;
        case "removeall":
            handleRemoveAll(user, callback);
            break;
        case "search":
            handleSearch(parsed, user, callback);
            break;
        case "viewseller":
            handleViewSeller(parsed.args.primary, user, callback);
            break;

        default:
            handleUndefined(user, callback);
            break;
    }
}

function handleSell(parsed, user, callback) {

    if (!user.name || !user.location) {
        var message = "Before you can add items ";

        if (!user.name) message += 'set your name with "setName"';
        if (!user.name && !user.location) message += " and ";
        if (!user.location) message += 'set your location with "setLocation"';

        callback(message);
        return;
    }

    var name = parsed.args.primary;
    if (!name) {
        callback('You must specify a name for your offer. Get more information with "learn sell".');
        return;
    }

    var description = parsed.args["description"];
    var price = parsed.args["price"];

    Offer.findOne({ 'name': name, 'userId': user._id }, function (err, offer) {
        if (err) console.log(err);

        if (offer) {
            offer.description = (description && description.value) ? description.value : null;
            offer.price = (price && price.value) ? parseFloat(price.value) : null;
            offer.save(function (err) {
                console.log(err);
                callback('Product ' + name + ' updated');
            });
        } else {
            offer = new Offer({
                name: name,
                description: description,
                price: price,
                date: new Date(),
                userId: user._id,
                lat: user.lat,
                lng: user.lng,
                location: user.location,
                userName: user.name
            });
            offer.save(function (err) {
                console.log(err);
                callback('Product "' + name + '" added');
            });
        }
    });
}

function updateLocation(user, callback) {
    Offer.update({ userId: user._id }, { $set: { lat: user.lat, lng: user.lng, location: user.location } }, { multi: true }, function (err) {
        if (err) console.log(err);
        callback();
    });
}

function updateName(user, callback) {
    Offer.update({ userId: user._id }, { $set: { userName: user.name } }, { multi: true }, function (err) {
        if (err) console.log(err);
        callback();
    });
}

function handleSetLocation(locationString, user, callback) {

    if (!locationString) {
        callback('You need to specify a location. Get more information with "learn setLocation".');
        return;
    }

    var options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: process.env.GOOGLE_APIKEY,
        formatter: null
    };

    var geocoder = NodeGeocoder(options);
    geocoder.geocode(locationString, function (err, res) {
        if (!err && res && res.length > 0) {
            user.lat = res[0].latitude;
            user.lng = res[0].longitude;
            user.location = locationString.toLowerCase();
            user.save(function (err) {
                if (err) console.log(err);
                updateLocation(user, function () {
                    callback("Location set to " + locationString);
                })
            });
        } else {
            callback("Location could not be found - try again with a more exact location");
        }
    });
}

function handleSetName(name, user, callback) {
    if (!name) {
        callback('You need to choose a name. Get more information with "learn setName".');
    } else if (name.length < 4 || name.length > 12) {
        callback('The name must be between 4 and 12 characters.');
    } else {
        user.name = name.toLowerCase();
        user.save(function (err) {
            if (err) {
                callback("The seller name " + name + " is already in use");
            } else {
                updateName(user, function () {
                    callback("Your seller name was updated");
                });
            }            
        });
    }
}

function handleSetDescription(description, user, callback) {
    user.description = description;
    user.save(function (err) {
        callback("Your seller description was updated");
    });
}

function handleSearch(parsed, user, callback) {

    if (!user.location) {
        callback('Before you can search you need to set your location with "setlocation"');
    } else {

        var query = parsed.args.primary;

        // extract override location
        var overrideLocation = parsed.args["location"] ? parsed.args["location"].value : null;

        // basic search
        var q = {
            $text: {
                $search: query + " " + (overrideLocation || user.location),
                $language: "none"
            }
        };

        // apply custom filters
        if (parsed.args["price"] && parsed.args["price"].value) {
            var val = parseFloat(parsed.args["price"].value);
            if (parsed.args["price"].comparison == "=") {
                q.price = val;
            } else if (parsed.args["price"].comparison == "<") {
                q.price = { $lt: val };
            } else if (parsed.args["price"].comparison == ">") {
                q.price = { $gt: val };
            }
        }
        if (parsed.args["seller"]) {
            q.userName = parsed.args["seller"].value;
        }

        Offer.find(
            q,
            { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .limit(5)
            .exec(function (err, results) {

                if (err) console.log(err);
                if (results && results.length > 0) {
                    var message = "";
                    for (var i = 0; i < results.length; i++) {
                        message += results[i].name + (results[i].price ? " $" + results[i].price : "") + " by " + results[i].userName + "\n";
                    }
                    callback(message);
                } else {
                    callback("No results found...");
                }
            });
    }
}

function handleList(user, callback) {
    Offer.find(
        { userId: user._id })
        .limit(5)
        .exec(function (err, results) {
            if (err) console.log(err);
            if (results && results.length > 0) {
                var message = "";
                for (var i = 0; i < results.length; i++) {
                    message += results[i].name + (results[i].price ? " $" + results[i].price : "") + "\n";
                }
                callback(message);
            } else {
                callback("There are no items in your store.");
            }
        });
}

function handleRemove(name, user, callback) {
    Offer.remove({ userId: user._id, name: name }, function (err) {
        if (err) console.log(err);
        callback(name + " was removed.");
    });
}

function handleRemoveAll(user, callback) {
    Offer.remove({ userId: user._id }, function (err) {
        if (err) console.log(err);
        callback("All your offers were removed.");
    });
}

function handleViewSeller(name, user, callback) {
    User.findOne({ 'name': name.toLowerCase() }, function (err, seller) {
        if (err) console.log(err);

        if (seller) {
            callback("Phone Number: " + seller.number + "\n" + "Location: " + seller.location + "\n" + (seller.description || ""));
        } else {
            callback("Seller with name " + name + " was not found.");
        }
    });
}

function handleHelp(topic, user, callback) {
    callback(guides(topic));
}

function handleCommands(user, callback) {
    callback(guides("commands"));
}

function handleUndefined(user, callback) {
    callback("Please correct your command or use \"learn\" to get help.");
}


module.exports = {
    handle: handle
};