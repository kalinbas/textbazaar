var Offer = require('../models/offer');
var User = require('../models/user');

var smsService = require('../services/smsService');

var NodeGeocoder = require('node-geocoder');

function handleSms(message, user, callback) {
    message = message.trim();
    var index = message.indexOf(" ");
    var cmd = message.substr(0, index > 0 ? index : message.length).toLowerCase();
    var params = message.substr(index > 0 ? index + 1 : message.length);

    switch (cmd) {
        case "setlocation":
            handleSetLocation(params, user, callback);
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
        case "?":
        	handleHelp(params, user, callback);
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
        if (err && err.code == 11000) {
            smsService.sendSms(user.number, "Product already exists..", callback);
        } else if (err) {
            console.log(err);
        } else {
            smsService.sendSms(user.number, "Product added..", callback);
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
                updateLocation(user, function () {
                    smsService.sendSms(user.number, "Location set to " + locationString, callback);
                })
            });
        } else {
            smsService.sendSms(user.number, "Location could not be found - try again with a different location string", callback);
        }
    });
}

function handleSetDescription(description, user, callback) {
    user.description = description;
    user.save(function (err) {
        smsService.sendSms(user.number, "Description was updated", callback);
    });
}

function handleSearch(query, user, callback) {

    if (!user.location) {
        smsService.sendSms(user.number, "Before you search you need to set your location with the command: setlocation", callback);
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
                    smsService.sendSms(user.number, message, callback);
                } else {
                    smsService.sendSms(user.number, "No results found...", callback);
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
                smsService.sendSms(user.number, message, callback);
            } else {
                smsService.sendSms(user.number, "There are no items in your store.", callback);
            }
        });
}

function handleRemove(name, user, callback) {
    Offer.remove({ userId: user._id, name: name }, function (err) {
        if (err) console.log(err);
        smsService.sendSms(user.number, "The item " + name + " was removed from your store.", callback);
    });
}

function handleRemoveAll(user, callback) {
    Offer.remove({ userId: user._id }, function (err) {
        if (err) console.log(err);
        smsService.sendSms(user.number, "All your items were removed from your store.", callback);
    });
}

function handleUserInfo(code, user, callback) {
    User.findOne({ 'code': code }, function (err, seller) {
        if (err) console.log(err);

        if (seller) {
            smsService.sendSms(user.number, "Phone Number: " + seller.number + "\n" + "Location: " + seller.location + "\n" + seller.description, callback);
        } else {
            smsService.sendSms(user.number, "Seller with code " + code + " was not found.", callback);
        }
    });
}

function handleHelp(topic, user, callback) {
    smsService.sendSms(user.number, "Welcome to textbazaar. You may use the following commands...", callback);
}

function handleUndefined(user, callback) {
    smsService.sendSms(user.number, "Sorry I did not understand. Check your command again or use ? to get help.", callback);
}


module.exports = {
    handleSms: handleSms
};