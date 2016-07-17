var mongoose = require('mongoose');

var schema = new mongoose.Schema({    
    code: {type: String, required: true, index: { unique: true }},
    number: {type: String, required: true, index: { unique: true }},
    lat: Number,
	lng: Number,
    location: String,
    description: String,
    date : {type: Date, required: true}
});

var User = mongoose.model('User', schema);
module.exports = User;