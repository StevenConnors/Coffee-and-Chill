// app/models/rooms.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;    

// define the schema for our room model
var placeSchema = mongoose.Schema({
    place : String,
    description : String,
    lat : Number,
    lng : Number,
    crowdedness: Number,
    basement_floors: Number,
    floors: Number,
    isBuilding: Boolean,
    // floor_objs: 
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Place', placeSchema);