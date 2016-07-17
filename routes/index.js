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
	service.handle(req.body.Body, req.body.From, function () {
		res.end();
	});
});

router.get("/test", function (req, res) {
	service.handle(req.query.message, req.query.number, function () {
		res.end();
	});
});

module.exports = router;
