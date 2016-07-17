var express = require('express');
var async = require('async');
var linkifyHtml = require('linkifyjs/html');

var Offer = require('../models/offer');

var router = express.Router();

router.get('/', function (req, res) {

	res.render('index', {});
   
});

module.exports = router;
