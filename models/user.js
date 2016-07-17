var mongoose = require('mongoose');

var schema = new mongoose.Schema({    
    phone: {type: String, required: true, index: { unique: true }},
    lat: Number,
	lng: Number,
    date : {type: Date, required: true}
});

var User = mongoose.model('User', schema);
module.exports = User;