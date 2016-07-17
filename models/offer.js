var mongoose = require('mongoose');

var schema = new mongoose.Schema({    
    title: {type: String, required: true},
    description: String,
    amount: Number,
    lat: Number,
	lng: Number,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date : {type: Date, required: true}
});

schema.index(
    {
        title: 'text',
        description: 'text'
    },
    {
        weights: {
            title: 10,
            description: 5
        },
        name: "TextIndex",
        default_language: "none"
    });

var Offer = mongoose.model('Offer', schema);
module.exports = Offer;