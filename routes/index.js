var express = require('express');
var async = require('async');
var linkifyHtml = require('linkifyjs/html');

var Offer = require('../models/offer');
var User = require('../models/user');

var service = require('../services/service');
var smsService = require('../services/smsService');

var router = express.Router();

router.get('/', function (req, res) {
	res.render('index', {});
});

router.post('/sms', function (req, res) {
	service.handle(req.body.Body, req.body.From, function (message) {
		smsService.sendSms(req.body.From, message, function() {
			res.end();
		});		
	});
});

router.get("/test", function (req, res) {
	if (req.query.number) {
		service.handle(req.query.message, req.query.number, function (message) {
			res.send(message);
			res.end();
		});
	} else {
		res.status(400).send('Error 400: mandatory GET parameter "number" is missing');
		res.end();
	}
});

module.exports = router;
