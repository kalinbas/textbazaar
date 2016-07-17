var express = require('express');
var async = require('async');
var linkifyHtml = require('linkifyjs/html');

var Offer = require('../models/offer');

var router = express.Router();

router.get('/', function (req, res) {

	res.render('index', {});
   
});

router.post('/sms', function (req, res) {

	var offerTest = new Offer({"test":"test"});
	offerTest.save();

	var offer = new Offer(req.body);
    offer.save();

	res.end();
});

module.exports = router;
