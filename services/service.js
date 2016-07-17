var Offer = require('../models/offer');
var User = require('../models/user');

var smsService = require('../services/smsService');

var NodeGeocoder = require('node-geocoder');
var randomString = require("randomstring");

var Parser = require('./parser');

function handle(message, number, callback) {
    // check if user exists - otherwise create
    User.findOne({ 'number': number }, function (err, user) {
        if (err) console.log(err);

        if (user) {
            handleSms(message, user, callback);
        } else {
            user = new User({ number: number, date: new Date(), code: generateRandomCode() });
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

    switch (parsed.command) {
        case "?":
            handleHelp(parsed.primary, user, callback);
            break;
        case "setlocation":
            handleSetLocation(parsed.primary, user, callback);
            break;
        case "setdescription":
            handleSetDescription(params, user, callback);
            break;
        case "sell":
            var values = params.split(",");
            handleSell({ name: values[0], price: parseInt(values[1], 10), description: values[2] }, user, callback);
            break;
        case "list":
            handleList(user, callback);
            break;
        case "remove":
            handleRemove(params, user, callback);
            break;
        case "removeall":
            handleRemoveAll(user, callback);
            break;
        case "search":
            handleSearch(params, user, callback);
            break;
        case "userinfo":
            handleUserInfo(params, user, callback);
            break;

        default:
            handleUndefined(user, callback);
            break;
    }
}

function handleSell(offer, user, callback) {
    var offer = new Offer({
        name: offer.name,
        description: offer.description,
        price: offer.price,
        date: new Date(),
        userId: user._id,
        lat: user.lat,
        lng: user.lng,
        location: user.location,
        code: user.code
    });

    offer.save(function (err) {
        if (!err) {
             callback("Product added..");
        } else {
            console.log(err);       

            // probably error 11000 - better error handling needed
            callback("Product already exists..");            
        }       
    });
}

function updateLocation(user, callback) {
    Offer.update({ userId: user._id }, { $set: { lat: user.lat, lng: user.lng, location: user.location } }, { multi: true }, function (err) {
        if (err) console.log(err);
        callback();
    });
}

function handleSetLocation(locationString, user, callback) {

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
            user.location = locationString;
            user.save(function (err) {
                if (err) console.log(err);
                updateLocation(user, function () {
                    callback("Location set to " + locationString);
                })
            });
        } else {
            callback("Location could not be found - try again with a different location string");
        }
    });
}

function handleSetDescription(description, user, callback) {
    user.description = description;
    user.save(function (err) {
        callback("Description was updated");
    });
}

function handleSearch(query, user, callback) {

    if (!user.location) {
        callback("Before you search you need to set your location with the command: setlocation");
    } else {
        Offer.find(
            {
                $text: {
                    $search: query + " " + user.location, // add location to free text search - TODO do searching based on coordinates
                    $language: "none"
                }
            },
            { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .limit(5)
            .exec(function (err, results) {

                if (err) console.log(err);
                if (results && results.length > 0) {
                    var message = "";
                    for (var i = 0; i < results.length; i++) {
                        message += results[i].code + " - " + results[i].name + " $" + results[i].price + "\n";
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
                    message += results[i].name + " $" + results[i].price + "\n";
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
        callback("The item " + name + " was removed from your store.");
    });
}

function handleRemoveAll(user, callback) {
    Offer.remove({ userId: user._id }, function (err) {
        if (err) console.log(err);
        callback("All your items were removed from your store.");
    });
}

function handleUserInfo(code, user, callback) {
    User.findOne({ 'code': code }, function (err, seller) {
        if (err) console.log(err);

        if (seller) {
            callback("Phone Number: " + seller.number + "\n" + "Location: " + seller.location + "\n" + seller.description);
        } else {
            callback("Seller with code " + code + " was not found.");
        }
    });
}

function handleHelp(topic, user, callback) {
    switch (topic) {
        case "search":
            callback("Help about search");
            break;

            //TODO other topics
        default:
            callback("Welcome to textbazaar. You may use the following commands...");
            break;

    }
}

function handleUndefined(user, callback) {
    callback("Sorry I did not understand. Please correct your command or use ? to get help.");
}

function generateRandomCode() {
    return randomString.generate({
        length: 5,
        charset: 'alphabetic'
    }).toLowerCase();
}

module.exports = {
    handle: handle
};