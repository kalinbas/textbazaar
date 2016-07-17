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
        case "sell":
            var values = params.split(",");
            handleSell({ name: values[0], price: parseInt(values[1], 10), description: values[2] }, user, callback);
            break;
        case "search":
            handleSearch(params, user, callback);
            break;
        default:
            handleHelp(params, user, callback);
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
        location: user.location
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

function handleSearch(query, user, callback) {
    Offer.find(
        {
            $text: {
                $search: query,
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
                    message += results[i].name + " $" + results[i].price + "\n";
                }
                smsService.sendSms(user.number, message, callback);
            } else {
                smsService.sendSms(user.number, "No results found...", callback);
            }
        });
}

function handleHelp(topic, user, callback) {
    smsService.sendSms(user.number, "Welcome to textbazaar. You may use the following commands...", callback);
}

module.exports = {
    handleSms: handleSms
};