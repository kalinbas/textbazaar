var express = require('express');
var async = require('async');
var linkifyHtml = require('linkifyjs/html');

var Offer = require('../models/offer');
var User = require('../models/user');

var service = require('../services/service');

var router = express.Router();

router.get('/', function (req, res) {
	res.render('index', {});
});

router.post('/sms', function (req, res) {
	handleSms(req.Body, req.From, function () {
		res.end();
	});
});

router.get("/test", function (req, res) {
	handleSms(req.query.message, req.query.number, function () {
		res.end();
	});
});

function handleSms(message, number, callback) {
	// check if user exists - otherwise create
	User.findOne({ 'number': number }, function (err, user) {
		if (err) console.log(err);

		if (user) {
			service.handleSms(message, user, callback);
		} else {
			user = new User({ number: number, date: new Date() });
			user.save(function (err) {
				if (err) console.log(err);

				service.handleSms(message, user, callback);
			});
		}
	});
}

module.exports = router;
