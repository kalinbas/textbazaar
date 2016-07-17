var Offer = require('../models/offer');
var User = require('../models/user');

var smsService = require('../services/smsService');

var NodeGeocoder = require('node-geocoder');

function handleSms(message, user, callback) {
    message = message.trim();
    var index = message.indexOf(" ");
    var cmd = message.substr(0, index > 0 ? index : message.length).toLowerCase();
    var params = message.substr(index > 0 ? index : message.length);

    switch (cmd) {
        case "location":
            handleLocation(params, user, callback);
            break;
        case "help":
            handleHelp(params, user, callback);
            break;
        default:
            callback();
    }
}

function handleLocation(locationString, user, callback) {

    var options = {
        provider: 'google', 
        httpAdapter: 'https', 
        apiKey: process.env.GOOGLE_APIKEY,
        formatter: null
    };

    var geocoder = NodeGeocoder(options);
    geocoder.geocode(locationString, function (err, res) {
        if (!err && res && res.length > 0) {
            smsService.sendSms(user.number, "Location set to " + locationString, callback);
        } else {
            smsService.sendSms(user.number, "Location could not be set - try again with a different location string", callback);
        }
    });
}

function handleHelp(topic, user, callback) {
    smsService.sendSms(user.number, "Welcome to textbazaar. You may use the following commands...", callback);
}

module.exports = {
    handleSms: handleSms
};