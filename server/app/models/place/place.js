// app/models/rooms.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;    

// define the schema for our room model
var placeSchema = mongoose.Schema({
    place : String,
    description : String,
    lat : Number,
    long : Number,
    popularity: Number,
    basement_floors: Number,
    floors: Number,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Place', placeSchema);
