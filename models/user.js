var mongoose = require('mongoose');

var schema = new mongoose.Schema({       
    number: {type: String, required: true, index: { unique: true }},
    name: {type: String, index: { unique: true }},
    description: String,
    lat: Number,
	lng: Number,
    location: String,    
    date : {type: Date, required: true}
});

var User = mongoose.model('User', schema);
module.exports = User;