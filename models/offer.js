var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    lat: Number,
	lng: Number,
    location: String,
    date: { type: Date, required: true }
});

schema.index({ userId: 1, name: 1}, { unique: true });

schema.index(
    {
        name: 'text',
        description: 'text',
        location: 'text'
    },
    {
        weights: {
            name: 10,
            description: 5,
            location: 10
        },
        name: "TextIndex",
        default_language: "none"
    });



var Offer = mongoose.model('Offer', schema);
module.exports = Offer;